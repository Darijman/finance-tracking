import { IsEnum, IsNumber, IsString, IsOptional, IsDate, MaxLength } from 'class-validator';
import { NoteType } from './financeNote.entity';
import { Transform } from 'class-transformer';

export class UpdateFinanceNoteDto {
  @IsOptional()
  @IsDate({ message: 'NoteDate must be a valid date!' })
  @Transform(({ value }) => (typeof value === 'string' ? new Date(value) : value))
  noteDate?: Date;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount?: number;

  @IsOptional()
  @IsEnum(NoteType)
  type?: NoteType;

  @IsOptional()
  @IsNumber({}, { message: 'CategoryId must be a number!' })
  @Transform(({ value }) => parseInt(value, 10))
  categoryId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Comment must contain no more than 255 letters!' })
  comment?: string;
}
