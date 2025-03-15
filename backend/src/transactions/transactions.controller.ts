import { Controller, Get, Post, Delete, Put, Body, Param, UseInterceptors, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './createTransaction.dto';
import { UpdateTransactionDto } from './updateTransaction.dto';
import { ParseInterceptor } from './parseInterceptor';
import { Admin } from 'src/auth/auth.decorators';
import { Transaction } from './transaction.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from 'src/users/users.service';
import { RolesService } from 'src/roles/roles.service';

@Controller('transactions')
@UseInterceptors(ParseInterceptor)
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  @Admin()
  @Get()
  async getAllTransactions(): Promise<Transaction[]> {
    return await this.transactionsService.getAllTransactions();
  }

  @UseGuards(AuthGuard)
  @Post()
  async createNewTransaction(@Body() createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    return await this.transactionsService.createNewTransaction(createTransactionDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getTransactionById(@Param('id') id: number, @Request() req: any): Promise<Transaction> {
    const currentUser = await this.usersService.getUserByIdWithRole(req.user.id);
    const transaction = await this.transactionsService.getTransactionById(id);
    if (currentUser.role.name === 'ADMIN') {
      return transaction;
    }

    if (currentUser.id !== transaction.userId) {
      throw new ForbiddenException({ error: 'You do not have permission to access this resource!' });
    }

    return transaction;
  }

  @UseGuards(AuthGuard)
  @Get('user/:userId')
  async getTransactionsByUserId(@Param('userId') userId: number, @Request() req: any): Promise<Transaction[]> {
    const currentUser = await this.usersService.getUserByIdWithRole(req.user.id);
    if (currentUser.role.name === 'ADMIN') {
      return await this.transactionsService.getTransactionsByUserId(userId);
    }

    if (currentUser.id !== userId) {
      throw new ForbiddenException({ error: 'You do not have permission to access this resource!' });
    }

    return await this.transactionsService.getTransactionsByUserId(userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteTransactionById(@Param('id') id: number): Promise<Transaction> {
    return await this.transactionsService.deleteTransactionById(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateTransactionById(@Param('id') id: number, @Body() updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    return await this.transactionsService.updateTransactionById(id, updateTransactionDto);
  }
}
