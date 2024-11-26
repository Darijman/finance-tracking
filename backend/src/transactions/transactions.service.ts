import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './createTransaction.dto';
import { UpdateTransactionDto } from './updateTransaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async getAllTransactions(): Promise<Transaction[]> {
    return await this.transactionsRepository.find();
  }

  async getTransactionById(id: number): Promise<Transaction | null> {
    return await this.transactionsRepository.findOneBy({ id });
  }

  async createNewTransaction(transaction: CreateTransactionDto): Promise<Transaction> {
    const newTransaction = this.transactionsRepository.create(transaction);
    return await this.transactionsRepository.save(newTransaction);
  }

  async deleteTransactionById(id: number): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOneBy({ id });
    await this.transactionsRepository.delete(id);
    return transaction;
  }

  async updateTransactionById(id: number, updateTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOneBy({ id });
    Object.assign(transaction, updateTransactionDto);
    return await this.transactionsRepository.save(transaction);
  }

  verifyChanges(transaction: Transaction, newTransaction: UpdateTransactionDto): boolean {
    let isUpdated = false;

    if (newTransaction.transactionDate !== transaction.transactionDate) {
      isUpdated = true;
    }
    if (newTransaction.amount !== transaction.amount) {
      isUpdated = true;
    }
    if (newTransaction.type !== transaction.type) {
      isUpdated = true;
    }
    if (newTransaction.category !== transaction.category) {
      isUpdated = true;
    }
    if (newTransaction.comment !== transaction.comment) {
      isUpdated = true;
    }

    return isUpdated;
  }
}
