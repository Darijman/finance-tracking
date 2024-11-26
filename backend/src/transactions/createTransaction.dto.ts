import { IsEnum, IsNumber, IsString, IsOptional, IsDate } from 'class-validator';
import { Categories, TransactionType } from './transaction.entity';

export class CreateTransactionDto {
  @IsDate()
  transactionDate: Date;

  @IsNumber()
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsEnum(Categories)
  category: Categories;

  @IsString()
  @IsOptional()
  comment?: string;
}
