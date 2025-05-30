import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterUserDto } from 'src/auth/registerUser.dto';
import { UpdateUserDto } from './updateUser.dto';
import { CurrenciesService } from 'src/currencies/currencies.service';
import { RedisService } from 'src/common/redis/redis.service';
import { getUserFinanceNotesCacheKey } from 'src/financeNotes/financeNotes.service';
import { plainToInstance } from 'class-transformer';
import { FinanceCategory } from 'src/financeCategories/financeCategory.entity';
import { FinanceNote } from 'src/financeNotes/financeNote.entity';
import { Currency } from 'src/currencies/currency.entity';

const getUserWithRoleCacheKey = (userId: number) => `userWithRole_${userId}`;
const getUserByIdCacheKey = (userId: number) => `userById_${userId}`;
const getUserCurrencyCacheKey = (userId: number) => `userCurrency_${userId}`;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private readonly currenciesService: CurrenciesService,
    private readonly redisService: RedisService,

    @InjectRepository(FinanceNote)
    private readonly financeNotesRepository: Repository<FinanceNote>,

    @InjectRepository(FinanceCategory)
    private readonly financeCategoriesRepository: Repository<FinanceCategory>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async getUserById(userId: number): Promise<User> {
    const cacheKey: string = getUserByIdCacheKey(userId);
    const cachedUser: string = await this.redisService.getValue(cacheKey);
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException({ error: 'User not found!' });
    }

    const transformedUser = plainToInstance(User, user);
    await this.redisService.setValue(cacheKey, JSON.stringify(transformedUser), 3600); //1hour
    return user;
  }

  async getUserByIdWithRole(userId: number): Promise<User> {
    const cacheKey: string = getUserWithRoleCacheKey(userId);
    const cachedUser: string = await this.redisService.getValue(cacheKey);
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['role'] });
    if (!user) {
      throw new NotFoundException({ error: 'User not found!' });
    }

    const transformedUser = plainToInstance(User, user);
    await this.redisService.setValue(cacheKey, JSON.stringify(transformedUser), 3600); //1hour
    return user;
  }

  async getUserByName(name: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ name });
    if (!user) {
      throw new NotFoundException({ error: 'User not found!' });
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException({ error: 'User not found!' });
    }
    return user;
  }

  async isUserNameTaken(name: string): Promise<boolean> {
    return !!(await this.usersRepository.findOneBy({ name }));
  }

  async isUserEmailTaken(email: string): Promise<boolean> {
    return !!(await this.usersRepository.findOneBy({ email }));
  }

  async registerNewUser(user: RegisterUserDto): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async deleteUserById(userId: number): Promise<{ success: boolean }> {
    await this.usersRepository.delete(userId);

    await this.redisService.deleteValue(getUserWithRoleCacheKey(userId));
    await this.redisService.deleteValue(getUserByIdCacheKey(userId));
    await this.redisService.deleteValue(getUserCurrencyCacheKey(userId));

    await this.financeNotesRepository.delete({ userId });
    await this.financeCategoriesRepository.delete({ userId });
    return { success: true };
  }

  async updateUserById(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException({ error: 'User not found!' });
    }

    const isUpdated = await this.verifyChanges(user, updateUserDto);
    if (!isUpdated) {
      throw new BadRequestException({ error: 'No changes were made!' });
    }

    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  async changeUserCurrencyId(userId: number, currencyId: number): Promise<{ success: boolean }> {
    if (isNaN(currencyId)) {
      throw new BadRequestException({ error: 'Invalid Currency ID!' });
    }

    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException({ error: 'User not found!' });
    }

    if (user.currencyId === currencyId) {
      throw new BadRequestException({ error: 'Invalid currency ID!' });
    }

    await this.currenciesService.getCurrencyById(currencyId);

    await this.redisService.deleteValue(getUserFinanceNotesCacheKey(userId)); // delete cached FinanceNotes since currency changed
    await this.redisService.deleteValue(getUserWithRoleCacheKey(userId)); // delete cached UserWithRole since currency changed
    await this.redisService.deleteValue(getUserCurrencyCacheKey(userId)); // delete cached UserCurrency since currency changed

    user.currencyId = currencyId;
    await this.usersRepository.save(user);
    return { success: true };
  }

  async getUserCurrency(userId: number): Promise<Currency> {
    const cacheKey: string = getUserCurrencyCacheKey(userId);
    const cachedUserCurrency: string = await this.redisService.getValue(cacheKey);
    if (cachedUserCurrency) {
      return JSON.parse(cachedUserCurrency);
    }

    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['currency'],
      select: ['currency'],
    });

    await this.redisService.setValue(cacheKey, JSON.stringify(user.currency), 3600); //1hour
    return user.currency;
  }

  async verifyChanges(user: User, updateUserDto: UpdateUserDto): Promise<boolean> {
    const { name, email } = user;

    if (updateUserDto.name && updateUserDto.name !== name) return true;
    if (updateUserDto.email && updateUserDto.email !== email) return true;

    if (updateUserDto.password) {
      const isSamePassword = await user.validatePassword(updateUserDto.password);
      if (!isSamePassword) return true;
    }

    return false;
  }
}
