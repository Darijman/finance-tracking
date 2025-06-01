import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { FinanceCategory } from './financeCategory.entity';
import { CreateFinanceCategoryDto } from './createFinanceCategory.dto';
import { UpdateFinanceCategoryDto } from './updateFinanceCategory.dto';
import { RedisService } from 'src/common/redis/redis.service';
import { CreateUserFinanceCategoryDto } from './createUserFinanceCategory.dto';
import { FinanceNote } from 'src/financeNotes/financeNote.entity';

const getCombinedFinanceCategoriesCacheKey = (userId: number) => `combinedFinanceCategories_user_${userId}`;
const getOnlyUserFinanceCategoriesCacheKey = (userId: number) => `onlyUserFinanceCategories_user_${userId}`;
const ALL_FINANCE_CATEGORIES_CACHE_KEY = `all_finance_categories`;

@Injectable()
export class FinanceCategoriesService {
  constructor(
    @InjectRepository(FinanceCategory)
    private financeCategoriesRepository: Repository<FinanceCategory>,

    @InjectRepository(FinanceNote)
    private financeNotesRepository: Repository<FinanceNote>,

    private readonly redisService: RedisService,
  ) {}

  async getAllFinanceCategories(): Promise<FinanceCategory[]> {
    const cachedFinanceCategories: string = await this.redisService.getValue(ALL_FINANCE_CATEGORIES_CACHE_KEY);
    if (cachedFinanceCategories) {
      return JSON.parse(cachedFinanceCategories);
    }

    const allFinanceCategories: FinanceCategory[] = await this.financeCategoriesRepository.find();
    await this.redisService.setValue(ALL_FINANCE_CATEGORIES_CACHE_KEY, JSON.stringify(allFinanceCategories), 86400); //1day
    return allFinanceCategories;
  }

  async getFinanceCategoryById(financeCategoryId: number): Promise<FinanceCategory> {
    return await this.financeCategoriesRepository.findOneBy({ id: financeCategoryId });
  }

  async getCombinedFinanceCategories(userId: number): Promise<FinanceCategory[]> {
    const cacheKey: string = getCombinedFinanceCategoriesCacheKey(userId);
    const cachedFinanceCategories: string = await this.redisService.getValue(cacheKey);

    if (cachedFinanceCategories) {
      return JSON.parse(cachedFinanceCategories);
    }

    const [baseCategories, userCategories] = await Promise.all([
      this.financeCategoriesRepository.find({ where: { user: IsNull() } }),
      this.financeCategoriesRepository.find({ where: { user: { id: userId } } }),
    ]);

    const combined = baseCategories.concat(userCategories);
    if (userCategories.length) {
      await this.redisService.setValue(cacheKey, JSON.stringify(combined), 3600); // 1hour
    }
    return combined;
  }

  async getOnlyUserCategories(userId: number): Promise<FinanceCategory[]> {
    const cacheKey: string = getOnlyUserFinanceCategoriesCacheKey(userId);
    const cachedFinanceCategories: string = await this.redisService.getValue(cacheKey);
    if (cachedFinanceCategories) {
      return JSON.parse(cachedFinanceCategories);
    }

    const userCategories: FinanceCategory[] = await this.financeCategoriesRepository.find({ where: { userId } });
    if (userCategories.length) {
      await this.redisService.setValue(cacheKey, JSON.stringify(userCategories), 3600); // 1hour
    }
    return userCategories;
  }

  async createNewFinanceCategory(createFinanceCategoryDto: CreateFinanceCategoryDto): Promise<FinanceCategory> {
    return await this.financeCategoriesRepository.save(createFinanceCategoryDto);
  }

  async createNewUserFinanceCategory(createNewUserFinanceCategory: CreateUserFinanceCategoryDto, userId: number): Promise<FinanceCategory> {
    const { name } = createNewUserFinanceCategory;

    const existingUserCategoriesCount = await this.financeCategoriesRepository.count({ where: { userId } });
    if (existingUserCategoriesCount >= 10) {
      throw new BadRequestException({ error: 'You can have up to 10 custom categories!' });
    }

    const userCategories: FinanceCategory[] = await this.getCombinedFinanceCategories(userId);
    const existingCategory = userCategories.some((category) => category.name === name);
    if (existingCategory) {
      throw new BadRequestException({ error: 'Category with this name already exists!' });
    }

    const newCategory = {
      name,
      userId,
      image: 'userCategory-icon.svg',
    };

    await this.redisService.deleteValue(getCombinedFinanceCategoriesCacheKey(userId));
    await this.redisService.deleteValue(getOnlyUserFinanceCategoriesCacheKey(userId));
    return await this.financeCategoriesRepository.save(newCategory);
  }

  async deleteFinanceCategory(financeCategory: FinanceCategory): Promise<FinanceCategory> {
    await this.financeNotesRepository.delete({ categoryId: financeCategory.id });
    await this.financeCategoriesRepository.delete(financeCategory.id);

    await this.redisService.deleteValue(getCombinedFinanceCategoriesCacheKey(financeCategory.userId));
    await this.redisService.deleteValue(getOnlyUserFinanceCategoriesCacheKey(financeCategory.userId));
    return financeCategory;
  }

  async updateFinanceCategoryById(
    financeCategory: FinanceCategory,
    updateFinanceCategoryDto: UpdateFinanceCategoryDto,
  ): Promise<FinanceCategory> {
    const isUpdated = this.verifyChanges(financeCategory, updateFinanceCategoryDto);
    if (!isUpdated) {
      throw new BadRequestException({ error: 'No changes were made!' });
    }

    Object.assign(financeCategory, updateFinanceCategoryDto);
    const updatedFinanceCategory = await this.financeCategoriesRepository.save(financeCategory);

    await this.redisService.deleteValue(getCombinedFinanceCategoriesCacheKey(financeCategory.userId));
    await this.redisService.deleteValue(getOnlyUserFinanceCategoriesCacheKey(financeCategory.userId));
    return updatedFinanceCategory;
  }

  verifyChanges(financeCategory: FinanceCategory, newFinanceCategory: UpdateFinanceCategoryDto): boolean {
    let isUpdated: boolean = false;

    if (newFinanceCategory.name && newFinanceCategory.name !== financeCategory.name) isUpdated = true;
    if (newFinanceCategory.image && newFinanceCategory.image !== financeCategory.image) isUpdated = true;
    if (newFinanceCategory.userId !== undefined && newFinanceCategory.userId !== financeCategory.userId) isUpdated = true;
    return isUpdated;
  }
}
