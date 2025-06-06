import { Controller, Get, Delete, Body, Param, UseInterceptors, Put, UseGuards, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './updateUser.dto';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Admin } from 'src/auth/auth.decorators';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from './user.entity';
import { OwnerOrAdminGuard } from 'src/guards/ownerOrAdmin.guard';
import { Currency } from 'src/currencies/currency.entity';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard, OwnerOrAdminGuard)
  @Get(':userId/details')
  async getUserByIdWithRole(@Param('userId') userId: number): Promise<User> {
    return await this.usersService.getUserByIdWithRole(userId);
  }

  @Admin()
  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.getAllUsers();
  }

  @UseGuards(AuthGuard, OwnerOrAdminGuard)
  @Get(':userId')
  async getUserById(@Param('userId') userId: number): Promise<User> {
    return await this.usersService.getUserById(userId);
  }

  @UseGuards(AuthGuard, OwnerOrAdminGuard)
  @Delete(':userId')
  async deleteUserById(@Param('userId') userId: number): Promise<{ success: boolean }> {
    return await this.usersService.deleteUserById(userId);
  }

  @UseGuards(AuthGuard, OwnerOrAdminGuard)
  @Put(':userId')
  async updateUserById(@Param('userId') userId: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.usersService.updateUserById(userId, updateUserDto);
  }

  @UseGuards(AuthGuard, OwnerOrAdminGuard)
  @Patch(':userId/currency')
  async changeUserCurrencyId(@Param('userId') userId: number, @Body() currencyDto: { currencyId: number }): Promise<{ success: boolean }> {
    return await this.usersService.changeUserCurrencyId(userId, currencyDto);
  }

  @UseGuards(AuthGuard, OwnerOrAdminGuard)
  @Get(':userId/currency')
  async getUserCurrency(@Param('userId') userId: number): Promise<Promise<Currency>> {
    return await this.usersService.getUserCurrency(userId);
  }
}
