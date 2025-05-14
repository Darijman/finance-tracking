import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCurrencyDto {
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Name must contain no more than 20 letters!' })
  @MinLength(1, { message: 'Name must contain at least 1 letter!' })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Symbol must contain no more than 20 letters!' })
  @MinLength(1, { message: 'Symbol must contain at least 1 letter!' })
  symbol?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Code must contain no more than 20 letters!' })
  @MinLength(1, { message: 'Code must contain at least 1 letter!' })
  code?: string;
}
