import { Controller, Get, Post, Delete, Put, Body, BadRequestException, Param, Inject, UseInterceptors } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './createTransaction.dto';
import { UpdateTransactionDto } from './updateTransaction.dto';
import { UsersService } from 'src/users/users.service';
import { Cache } from 'cache-manager';
import { ParseInterceptor } from './parseInterceptor';

const getUserTransactionsCacheKey = (userId: number) => `userTransactions_${userId}`;

@Controller('transactions')
@UseInterceptors(ParseInterceptor)
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  async getAllTransactions() {
    const allTransactions = await this.transactionsService.getAllTransactions();
    return allTransactions;
  }

  @Post()
  async createNewTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    const { transactionDate, amount, type, category, userId, comment } = createTransactionDto;

    const newTransaction = {
      transactionDate,
      amount,
      type,
      category,
      userId,
      comment,
    };

    const createdTransaction = await this.transactionsService.createNewTransaction(newTransaction);
    const userCacheKey = getUserTransactionsCacheKey(userId);
    await this.cacheManager.del(userCacheKey);
    return createdTransaction;
  }

  @Get(':id')
  async getTransactionById(@Param('id') id: number) {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID' });
    }

    const transaction = await this.transactionsService.getTransactionById(id);
    if (!transaction) {
      throw new BadRequestException({ error: 'Could not find the transaction!' });
    }

    return transaction;
  }

  @Get('user/:userId')
  async getTransactionsByUserId(@Param('userId') userId: number) {
    if (isNaN(userId)) {
      throw new BadRequestException({ error: 'Invalid user ID' });
    }

    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new BadRequestException({ error: 'Could not find the user!' });
    }

    const userCacheKey = getUserTransactionsCacheKey(userId);
    const cachedUserTransactions: any[] = await this.cacheManager.get(userCacheKey);
    if (cachedUserTransactions) {
      return cachedUserTransactions;
    }

    const userTransactions = await this.transactionsService.getTransactionsByUserId(userId);
    const parsedUserTransactions = userTransactions.map((transaction) => ({
      ...transaction,
      id: Number(transaction.id),
      amount: Number(transaction.amount),
    }));

    if (userTransactions.length) {
      await this.cacheManager.set(userCacheKey, parsedUserTransactions, 300000);
    }

    return parsedUserTransactions;
  }

  @Delete(':id')
  async deleteTransactionById(@Param('id') id: number) {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID' });
    }

    const transaction = await this.transactionsService.getTransactionById(id);
    if (!transaction) {
      throw new BadRequestException({ error: 'Could not find the transaction!' });
    }

    const userCacheKey = getUserTransactionsCacheKey(transaction.userId);
    await this.transactionsService.deleteTransactionById(id);
    await this.cacheManager.del(userCacheKey);
    return transaction;
  }

  @Put(':id')
  async updateTransactionById(@Body() updateTransactionDto: UpdateTransactionDto, @Param('id') id: number) {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID' });
    }

    const transaction = await this.transactionsService.getTransactionById(id);
    if (!transaction) {
      throw new BadRequestException({ error: 'Could not find the transaction!' });
    }

    const isUpdated = this.transactionsService.verifyChanges(transaction, updateTransactionDto);
    if (!isUpdated) {
      throw new BadRequestException({ error: 'No changes were made' });
    }

    const updatedTransaction = await this.transactionsService.updateTransactionById(id, updateTransactionDto);
    const userCacheKey = getUserTransactionsCacheKey(transaction.userId);
    await this.cacheManager.del(userCacheKey);
    return updatedTransaction;
  }
}
