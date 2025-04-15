import { IsNumber, IsString, IsOptional, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateFinanceCategoryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Name must contain no more than 100 letters!' })
  @MinLength(1, { message: 'Name must contain at least 1 letter!' })
  name?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsNumber({}, { message: 'UserId must be a number!' })
  @Transform(({ value }) => parseInt(value, 10))
  userId?: number;
}
