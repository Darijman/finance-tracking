import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinanceCategory } from './financeCategory.entity';
import { CreateFinanceCategoryDto } from './createFinanceCategory.dto';
import { UpdateFinanceCategoryDto } from './updateFinanceCategory.dto';
import { UsersService } from 'src/users/users.service';
import { RedisService } from 'src/common/redis/redis.service';
import { CreateUserFinanceCategoryDto } from './createUserFinanceCategory.dto';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/role.entity';
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

    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
    private readonly rolesService: RolesService,
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

  async getFinanceCategoryById(id: number): Promise<FinanceCategory> {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID!' });
    }

    const category = await this.financeCategoriesRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException({ error: 'Finance-Category not found!' });
    }

    return category;
  }

  async getFinanceCategoriesByUserId(userId: number): Promise<FinanceCategory[]> {
    if (isNaN(userId)) {
      throw new BadRequestException({ error: 'Invalid user ID!' });
    }

    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new NotFoundException({ error: 'User not found!' });
    }

    return await this.financeCategoriesRepository.find({ where: { userId } });
  }

  async getCombinedFinanceCategories(userId: number): Promise<FinanceCategory[]> {
    const cacheKey: string = getCombinedFinanceCategoriesCacheKey(userId);
    const cachedFinanceCategories: string = await this.redisService.getValue(cacheKey);

    if (cachedFinanceCategories) {
      return JSON.parse(cachedFinanceCategories);
    }

    const [baseCategories, userCategories] = await Promise.all([
      this.getAllFinanceCategories(),
      this.financeCategoriesRepository.find({ where: { userId } }),
    ]);

    const combined = baseCategories.concat(userCategories);
    await this.redisService.setValue(cacheKey, JSON.stringify(combined), 3600); // 1hour
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
    return await this.financeCategoriesRepository.save(newCategory);
  }

  async deleteFinanceCategoryById(financeCategoryId: number, userId: number, userRoleId: number): Promise<FinanceCategory> {
    if (isNaN(financeCategoryId)) {
      throw new BadRequestException({ error: 'Invalid ID!' });
    }

    const financeCategory = await this.financeCategoriesRepository.findOneBy({ id: financeCategoryId });
    if (!financeCategory) {
      throw new NotFoundException({ error: 'Finance-Category not found!' });
    }

    const allRoles: Role[] = await this.rolesService.getAllRoles();
    const adminRole: Role = allRoles.find((role) => role.name === 'ADMIN');

    const isOwner: boolean = financeCategory.userId === userId;
    const isAdmin: boolean = userRoleId === adminRole.id;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException({ error: 'You do not have permission!' });
    }

    await this.financeNotesRepository.delete({ categoryId: financeCategoryId });
    await this.financeCategoriesRepository.delete(financeCategoryId);

    const userCacheKeyCombined = getCombinedFinanceCategoriesCacheKey(financeCategory.userId);
    const userCacheKeyOnly = getOnlyUserFinanceCategoriesCacheKey(financeCategory.userId);

    await this.redisService.deleteValue(userCacheKeyCombined);
    await this.redisService.deleteValue(userCacheKeyOnly);
    return financeCategory;
  }

  async updateFinanceCategoryById(id: number, updateFinanceCategoryDto: UpdateFinanceCategoryDto): Promise<FinanceCategory> {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID!' });
    }

    const financeCategory = await this.financeCategoriesRepository.findOneBy({ id });
    if (!financeCategory) {
      throw new NotFoundException({ error: 'Finance-Category not found!' });
    }

    const isUpdated = this.verifyChanges(financeCategory, updateFinanceCategoryDto);
    if (!isUpdated) {
      throw new BadRequestException({ error: 'No changes were made!' });
    }

    Object.assign(financeCategory, updateFinanceCategoryDto);
    const updatedFinanceCategory = await this.financeCategoriesRepository.save(financeCategory);

    const userCacheKey = getCombinedFinanceCategoriesCacheKey(financeCategory.userId);
    await this.redisService.deleteValue(userCacheKey);
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
