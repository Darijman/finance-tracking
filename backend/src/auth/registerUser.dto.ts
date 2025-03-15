import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, IsNumber, IsOptional } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Name must contain at least 2 letters!' })
  @MaxLength(40, { message: 'Name must contain no more than 40 letters!' })
  name: string;

  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsOptional()
  roleId: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must contain at least 6 letters!' })
  @MaxLength(20, { message: 'Password must contain no more than 20 letters!' })
  password: string;
}
