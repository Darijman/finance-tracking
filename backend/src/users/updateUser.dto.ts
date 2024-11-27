import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Name should not be empty!' })
  @MinLength(2, { message: 'Name must contain at least 2 letters!' })
  @MaxLength(40, { message: 'Name must contain no more than 40 letters!' })
  name?: string;

  @IsOptional()
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email should not be empty!' })
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Password should not be empty!' })
  @MinLength(6, { message: 'Password must contain at least 6 letters!' })
  @MaxLength(20, { message: 'Password must contain no more than 20 letters!' })
  password?: string;
}
