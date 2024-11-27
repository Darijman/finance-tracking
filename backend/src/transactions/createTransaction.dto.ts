import { IsEnum, IsNumber, IsString, IsOptional, IsDate, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Categories, TransactionType } from './transaction.entity';

export class CreateTransactionDto {
  @IsDate({ message: 'TransactionDate must be a valid Date!' })
  transactionDate: Date;

  @IsNumber()
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsEnum(Categories)
  category: Categories;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(255, { message: 'Comment must contain no more than 255 letters!' })
  @MinLength(1, { message: 'Comment must contain at least 1 letter!' })
  comment?: string;
}
