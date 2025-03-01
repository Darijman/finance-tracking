import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterUserDto } from './createUser.dto';
import { UpdateUserDto } from './updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    const allUsers: User[] = await this.usersRepository.find();
    return allUsers;
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findUserByName(name: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ name });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ email });
  }

  async registerNewUser(user: RegisterUserDto): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return await this.usersRepository.save(newUser);
  }

  async deleteUserById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    await this.usersRepository.delete(id);
    return user;
  }

  async updateUserById(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  async verifyChanges(user: User, updateUserDto: UpdateUserDto): Promise<boolean> {
    const { name, email } = user;
    if (name !== updateUserDto.name) return true;
    if (email !== updateUserDto.email) return true;

    const isPasswordUpdated = await user.validatePassword(updateUserDto.password);
    return !isPasswordUpdated;
  }
}
