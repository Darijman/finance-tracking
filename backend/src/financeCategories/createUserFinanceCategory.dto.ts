import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserFinanceCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30, { message: 'Name must contain no more than 30 letters!' })
  @MinLength(1, { message: 'Name must contain at least 1 letter!' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name: string;
}
