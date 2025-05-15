import { Controller, Get, Delete, Body, Param, UseInterceptors, Put, UseGuards, Patch, Req, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './updateUser.dto';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Admin } from 'src/auth/auth.decorators';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from './user.entity';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Admin()
  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.getAllUsers();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return await this.usersService.getUserById(id);
  }

  @UseGuards(AuthGuard)
  @Get(':id/details')
  async getUserByIdWithRole(@Param('id') id: number): Promise<User> {
    return await this.usersService.getUserByIdWithRole(id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUserById(@Param('id') id: number): Promise<User> {
    return await this.usersService.deleteUserById(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateUserById(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.usersService.updateUserById(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Patch('/currency/:currencyId')
  async changeUserCurrencyId(@Param('currencyId') currencyId: number, @Req() req: any): Promise<boolean> {
    const userId = req?.user?.id;

    if (!userId) {
      throw new UnauthorizedException({ error: 'Something went wrong..' });
    }
    return await this.usersService.changeUserCurrencyId(userId, currencyId);
  }
}
