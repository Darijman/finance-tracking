import { IsString, IsNotEmpty, MinLength, MaxLength, IsEmail } from 'class-validator';

export class LogInUserDto {
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(254, { message: 'Email must contain no more than 254 characters!' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must contain at least 6 letters!' })
  @MaxLength(20, { message: 'Password must contain no more than 20 letters!' })
  password: string;
}
