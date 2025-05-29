import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateCurrencyDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50, { message: 'Name must contain no more than 50 letters!' })
  @MinLength(1, { message: 'Name must contain at least 1 letter!' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20, { message: 'Symbol must contain no more than 20 letters!' })
  @MinLength(1, { message: 'Symbol must contain at least 1 letter!' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  symbol: string;

  @IsNotEmpty()
  @IsString()
  flag: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20, { message: 'Code must contain no more than 20 letters!' })
  @MinLength(1, { message: 'Code must contain at least 1 letter!' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  code: string;
}
