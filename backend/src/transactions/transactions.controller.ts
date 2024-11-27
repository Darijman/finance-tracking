import { Controller, Get, Post, Delete, Put, Body, BadRequestException, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './createTransaction.dto';
import { UpdateTransactionDto } from './updateTransaction.dto';
import { UsersService } from 'src/users/users.service';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getAllTransactions() {
    const allTransactions = await this.transactionsService.getAllTransactions();
    const parsedIds = allTransactions.map((transaction) => {
      return { ...transaction, id: Number(transaction.id) };
    });
    return parsedIds;
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
    createdTransaction.id = Number(createdTransaction.id);
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

    transaction.id = Number(transaction.id);
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

    return await this.transactionsService.getTransactionsByUserId(userId);
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

    await this.transactionsService.deleteTransactionById(id);
    transaction.id = Number(transaction.id);
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
    updatedTransaction.id = Number(updatedTransaction.id);
    return updatedTransaction;
  }
}
