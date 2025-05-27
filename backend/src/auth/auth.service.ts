import { BadRequestException, Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './registerUser.dto';
import { LogInUserDto } from './logInUser.dto';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/role.entity';
import { Roles } from 'src/roles/role.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private rolesService: RolesService,
  ) {}

  async registerNewUser(@Body() registerUserDto: RegisterUserDto): Promise<{ access_token: string }> {
    const { name, email, rememberMe } = registerUserDto;

    const nameExists: boolean = await this.usersService.isUserNameTaken(name);
    if (nameExists) {
      throw new BadRequestException({ error: 'This name is taken!', type: 'NAME' });
    }

    const emailExists: boolean = await this.usersService.isUserEmailTaken(email);
    if (emailExists) {
      throw new BadRequestException({ error: 'This email is already in use!', type: 'EMAIL' });
    }

    const allRoles: Role[] = await this.rolesService.getAllRoles();
    const userRole: Role = allRoles.find((role) => role.name === Roles.USER);

    if (!registerUserDto.roleId) {
      registerUserDto.roleId = userRole.id;
    }

    const createdUser = await this.usersService.registerNewUser(registerUserDto);
    const payload = { id: createdUser.id, name: createdUser.name, roleId: createdUser.roleId, roleName: userRole.name };
    const expiresIn = rememberMe ? '30d' : '7d';

    return {
      access_token: await this.jwtService.signAsync(payload, { expiresIn }),
    };
  }

  async logIn(@Body() logInUserDto: LogInUserDto): Promise<{ access_token: string }> {
    const { email, password, rememberMe } = logInUserDto;
    const user = await this.usersService.getUserByEmail(email);

    const isPasswordCorrect = await user.validatePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException({ error: 'Incorrect password!' });
    }

    const payload = { id: user.id, name: user.name, roleId: user.roleId, roleName: user.role.name };
    const expiresIn = rememberMe ? '30d' : '7d';

    return {
      access_token: await this.jwtService.signAsync(payload, { expiresIn }),
    };
  }
}
