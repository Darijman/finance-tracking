import { BadRequestException, Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './registerUser.dto';
import { LogInUserDto } from './logInUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registerNewUser(@Body() registerUserDto: RegisterUserDto): Promise<{ access_token: string }> {
    const { name, email } = registerUserDto;

    const nameExists = await this.usersService.isUserNameTaken(name);
    if (nameExists) {
      throw new BadRequestException({ error: 'This name is taken!', type: 'NAME' });
    }

    const emailExists = await this.usersService.isUserEmailTaken(email);
    if (emailExists) {
      throw new BadRequestException({ error: 'This email is already in use!', type: 'EMAIL' });
    }

    const createdUser = await this.usersService.registerNewUser(registerUserDto);
    const payload = { id: createdUser.id, name: createdUser.name, roleId: createdUser.roleId };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async logIn(@Body() logInUserDto: LogInUserDto): Promise<{ access_token: string }> {
    const { email, password } = logInUserDto;
    const user = await this.usersService.getUserByEmail(email);

    const isPasswordCorrect = await user.validatePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException({ error: 'Incorrect password!' });
    }

    const payload = { id: user.id, name: user.name, roleId: user.roleId };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
