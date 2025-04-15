import { IsEnum, IsNumber, IsString, IsOptional, IsDate, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { NoteType } from './financeNote.entity';
import { Transform } from 'class-transformer';

export class CreateFinanceNoteDto {
  @IsDate({ message: 'NoteDate must be a valid Date!' })
  @Transform(({ value }) => (typeof value === 'string' ? new Date(value) : value))
  noteDate: Date;

  @IsNumber()
  @IsNotEmpty({ message: 'Amount must not be empty!' })
  amount: number;

  @IsEnum(NoteType)
  type: NoteType;

  @IsNumber({}, { message: 'CategoryId must be a number!' })
  @IsNotEmpty({ message: 'CategoryId is required!' })
  @Transform(({ value }) => parseInt(value, 10))
  categoryId: number;

  @IsNotEmpty({ message: 'UserId is required!' })
  @IsNumber({}, { message: 'UserId must be a number!' })
  @Transform(({ value }) => parseInt(value, 10))
  userId: number;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Comment must contain no more than 255 letters!' })
  @MinLength(1, { message: 'Comment must contain at least 1 letter!' })
  comment?: string;
}
