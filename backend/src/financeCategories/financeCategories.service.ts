import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinanceCategory } from './financeCategory.entity';
import { CreateFinanceCategoryDto } from './createFinanceCategory.dto';
import { UpdateFinanceCategoryDto } from './updateFinanceCategory.dto';
import { UsersService } from 'src/users/users.service';
import { RedisService } from 'src/common/redis/redis.service';

const getUserFinanceCategoryCacheKey = (userId: number) => `userFinanceCategories_${userId}`;

@Injectable()
export class FinanceCategoriesService {
  constructor(
    @InjectRepository(FinanceCategory)
    private financeCategoriesRepository: Repository<FinanceCategory>,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
  ) {}

  async getAllFinanceCategories(): Promise<FinanceCategory[]> {
    return await this.financeCategoriesRepository.find();
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

    const userCacheKey: string = getUserFinanceCategoryCacheKey(userId);
    const cachedUserFinanceCategories: string = await this.redisService.getValue(userCacheKey);
    if (cachedUserFinanceCategories) {
      return JSON.parse(cachedUserFinanceCategories);
    }

    const userFinanceCategories = await this.financeCategoriesRepository.find({ where: { userId } });
    if (userFinanceCategories.length) {
      await this.redisService.setValue(userCacheKey, JSON.stringify(userFinanceCategories), 300); // 5min
    }

    return userFinanceCategories;
  }

  async createNewFinanceCategory(createFinanceCategoryDto: CreateFinanceCategoryDto): Promise<FinanceCategory> {
    if (createFinanceCategoryDto.userId) {
      const existingUser = await this.usersService.getUserById(createFinanceCategoryDto.userId);
      if (!existingUser) {
        throw new NotFoundException({ error: 'User not found!' });
      }

      const userCacheKey = getUserFinanceCategoryCacheKey(createFinanceCategoryDto.userId);
      await this.redisService.deleteValue(userCacheKey);
    }

    const newFinanceCategory = this.financeCategoriesRepository.create(createFinanceCategoryDto);
    const createdFinanceCategory = await this.financeCategoriesRepository.save(newFinanceCategory);
    return createdFinanceCategory;
  }

  async deleteFinanceCategoryById(id: number): Promise<FinanceCategory> {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID!' });
    }

    const financeCategory = await this.financeCategoriesRepository.findOneBy({ id });
    if (!financeCategory) {
      throw new NotFoundException({ error: 'Finance-Category not found!' });
    }

    const userCacheKey = getUserFinanceCategoryCacheKey(financeCategory.userId);
    await this.financeCategoriesRepository.delete(id);
    await this.redisService.deleteValue(userCacheKey);
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

    const userCacheKey = getUserFinanceCategoryCacheKey(financeCategory.userId);
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
