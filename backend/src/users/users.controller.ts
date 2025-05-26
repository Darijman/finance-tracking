import { Controller, Get, Delete, Body, Param, UseInterceptors, Put, UseGuards, Patch, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './updateUser.dto';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Admin } from 'src/auth/auth.decorators';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from './user.entity';
import { Request as ExpressRequest } from 'express';
import { OwnerOrAdminGuard } from 'src/guards/ownerOrAdmin.guard';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard, OwnerOrAdminGuard)
  @Get(':userId/details')
  async getUserByIdWithRole(@Param('id') id: number): Promise<User> {
    return await this.usersService.getUserByIdWithRole(id);
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
  async deleteUserById(@Param('userId') userId: number): Promise<User> {
    return await this.usersService.deleteUserById(userId);
  }

  @UseGuards(AuthGuard, OwnerOrAdminGuard)
  @Put(':userId')
  async updateUserById(@Param('userId') userId: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.usersService.updateUserById(userId, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Patch('/currency/:currencyId')
  async changeUserCurrencyId(@Param('currencyId') currencyId: number, @Req() req: ExpressRequest): Promise<boolean> {
    return await this.usersService.changeUserCurrencyId(req.user.id, currencyId);
  }
}
