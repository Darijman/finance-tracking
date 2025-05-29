import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCurrencyDto {
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Name must contain no more than 20 letters!' })
  @MinLength(1, { message: 'Name must contain at least 1 letter!' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Symbol must contain no more than 20 letters!' })
  @MinLength(1, { message: 'Symbol must contain at least 1 letter!' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  symbol?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1, { message: 'Flag must contain only 1 letter!' })
  @MinLength(1, { message: 'Flag must contain only 1 letter!' })
  flag: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Code must contain no more than 20 letters!' })
  @MinLength(1, { message: 'Code must contain at least 1 letter!' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  code?: string;
}
