import { IsEnum, IsNumber, IsString, IsOptional, IsDate, MaxLength, MinLength, IsNotEmpty } from 'class-validator';
import { Categories, TransactionType } from './transaction.entity';
import { Transform } from 'class-transformer';

export class UpdateTransactionDto {
  @IsOptional()
  @IsDate({ message: 'TransactionDate must be a valid date!' })
  @Transform(({ value }) => (typeof value === 'string' ? new Date(value) : value))
  transactionDate?: Date;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsEnum(Categories)
  category?: Categories;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(255, { message: 'Comment must contain no more than 255 letters!' })
  @MinLength(1, { message: 'Comment must contain at least 1 letter!' })
  comment?: string;
}
