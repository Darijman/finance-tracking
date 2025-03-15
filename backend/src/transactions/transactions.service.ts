import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './createTransaction.dto';
import { UpdateTransactionDto } from './updateTransaction.dto';
import { UsersService } from 'src/users/users.service';

const getUserTransactionsCacheKey = (userId: number) => `userTransactions_${userId}`;

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAllTransactions(): Promise<Transaction[]> {
    return await this.transactionsRepository.find();
  }

  async getTransactionById(id: number): Promise<Transaction> {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID!' });
    }

    const transaction = await this.transactionsRepository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException({ error: 'Transaction not found!' });
    }

    return transaction;
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    if (isNaN(userId)) {
      throw new BadRequestException({ error: 'Invalid user ID!' });
    }

    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new NotFoundException({ error: 'User not found!' });
    }

    const userCacheKey = getUserTransactionsCacheKey(userId);
    const cachedUserTransactions: Transaction[] | null = await this.cacheManager.get(userCacheKey);
    if (cachedUserTransactions) {
      return cachedUserTransactions;
    }

    const userTransactions = await this.transactionsRepository.find({ where: { userId } });
    if (userTransactions.length) {
      await this.cacheManager.set(userCacheKey, userTransactions, 300000);
    }

    return userTransactions;
  }

  async createNewTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const { userId } = createTransactionDto;

    const existingUser = await this.usersService.getUserById(userId);
    if (!existingUser) {
      throw new NotFoundException({ error: 'User not found!' });
    }

    const newTransaction = this.transactionsRepository.create(createTransactionDto);
    const createdTransaction = await this.transactionsRepository.save(newTransaction);

    const userCacheKey = getUserTransactionsCacheKey(userId);
    await this.cacheManager.del(userCacheKey);
    return createdTransaction;
  }

  async deleteTransactionById(id: number): Promise<Transaction> {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID!' });
    }

    const transaction = await this.transactionsRepository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException({ error: 'Transaction not found!' });
    }

    const userCacheKey = getUserTransactionsCacheKey(transaction.userId);
    await this.transactionsRepository.delete(id);
    await this.cacheManager.del(userCacheKey);
    return transaction;
  }

  async updateTransactionById(id: number, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID!' });
    }

    const transaction = await this.transactionsRepository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException({ error: 'Transaction not found!' });
    }

    const isUpdated = this.verifyChanges(transaction, updateTransactionDto);
    if (!isUpdated) {
      throw new BadRequestException({ error: 'No changes were made!' });
    }

    Object.assign(transaction, updateTransactionDto);
    const updatedTransaction = await this.transactionsRepository.save(transaction);

    const userCacheKey = getUserTransactionsCacheKey(transaction.userId);
    await this.cacheManager.del(userCacheKey);
    return updatedTransaction;
  }

  verifyChanges(transaction: Transaction, newTransaction: UpdateTransactionDto): boolean {
    let isUpdated: boolean = false;

    if (newTransaction.amount && newTransaction.amount !== Number(transaction.amount)) isUpdated = true;
    if (newTransaction.category && newTransaction.category !== transaction.category) isUpdated = true;
    if (newTransaction.comment && newTransaction.comment !== transaction.comment) isUpdated = true;
    if (newTransaction.type && newTransaction.type !== transaction.type) isUpdated = true;
    if (newTransaction.transactionDate && newTransaction.transactionDate.getTime() !== transaction.transactionDate.getTime()) {
      isUpdated = true;
    }
    return isUpdated;
  }
}
