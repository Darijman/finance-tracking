import { IsNumber, IsString, IsOptional, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateFinanceCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30, { message: 'Name must contain no more than 30 letters!' })
  @MinLength(1, { message: 'Name must contain at least 1 letter!' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsNumber({}, { message: 'UserId must be a number!' })
  @Transform(({ value }) => parseInt(value, 10))
  userId?: number;
}
