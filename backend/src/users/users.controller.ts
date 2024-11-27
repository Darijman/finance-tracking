import { Controller, Get, Post, Delete, Body, BadRequestException, Param, UseInterceptors, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './createUser.dto';
import { UpdateUserDto } from './updateUser.dto';
import { ClassSerializerInterceptor } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async getAllUsers() {
    const allUsers = await this.usersService.getAllUsers();
    return allUsers;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async createNewUser(@Body() createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const nameExists = await this.usersService.findUserByName(name);
    if (nameExists) {
      throw new BadRequestException({ error: 'This name is taken!' });
    }

    const newUser = {
      name,
      email,
      password,
    };

    const createdUser = await this.usersService.createNewUser(newUser);
    return createdUser;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getUserById(@Param('id') id: number) {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID' });
    }

    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new BadRequestException({ error: 'Could not find the user!' });
    }
    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async deleteUserById(@Param('id') id: number) {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID' });
    }

    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new BadRequestException({ error: 'Could not find the user!' });
    }

    await this.usersService.deleteUserById(id);
    return user;
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async updateUserById(@Body() updateUserDto: UpdateUserDto, @Param('id') id: number) {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID' });
    }

    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new BadRequestException({ error: 'Could not find the user!' });
    }

    const isUpdated = await this.usersService.verifyChanges(user, updateUserDto);
    if (!isUpdated) {
      throw new BadRequestException({ error: 'No changes were made' });
    }

    const updatedUser = await this.usersService.updateUserById(id, updateUserDto);
    return updatedUser;
  }
}
