import { IsEnum, IsNumber, IsString, IsOptional, IsDate, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Categories, TransactionType } from './transaction.entity';
import { Transform } from 'class-transformer';

export class CreateTransactionDto {
  @IsDate({ message: 'TransactionDate must be a valid Date!' })
  @Transform(({ value }) => (typeof value === 'string' ? new Date(value) : value))
  transactionDate: Date;

  @IsNumber()
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsEnum(Categories)
  category: Categories;

  @IsNotEmpty({ message: 'UserId is required!' })
  @IsNumber({}, { message: 'UserId must be a number!' })
  @Transform(({ value }) => parseInt(value, 10))
  userId: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: 'Comment must contain no more than 255 letters!' })
  @MinLength(1, { message: 'Comment must contain at least 1 letter!' })
  comment?: string;
}
