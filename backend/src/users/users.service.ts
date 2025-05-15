import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterUserDto } from 'src/auth/registerUser.dto';
import { UpdateUserDto } from './updateUser.dto';
// import { Currency } from 'src/currencies/currency.entity';
import { CurrenciesService } from 'src/currencies/currencies.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private readonly currenciesService: CurrenciesService,
    private jwtService: JwtService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async getUserById(id: number): Promise<User> {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID!' });
    }

    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException({ error: 'User not found!' });
    }
    return user;
  }

  async getUserByIdWithRole(id: number): Promise<User> {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID!' });
    }

    const user = await this.usersRepository.findOne({ where: { id }, relations: ['role'] });
    if (!user) {
      throw new NotFoundException({ error: 'User not found!' });
    }
    return user;
  }

  async getUserByName(name: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ name });
    if (!user) {
      throw new NotFoundException({ error: 'User not found!' });
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException({ error: 'User not found!' });
    }
    return user;
  }

  async isUserNameTaken(name: string): Promise<boolean> {
    return !!(await this.usersRepository.findOneBy({ name }));
  }

  async isUserEmailTaken(email: string): Promise<boolean> {
    return !!(await this.usersRepository.findOneBy({ email }));
  }

  async registerNewUser(user: RegisterUserDto): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return await this.usersRepository.save(newUser);
  }

  async deleteUserById(id: number): Promise<User> {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID!' });
    }

    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException({ error: 'User not found!' });
    }

    await this.usersRepository.delete(id);
    return user;
  }

  async updateUserById(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID!' });
    }

    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException({ error: 'User not found!' });
    }

    const isUpdated = await this.verifyChanges(user, updateUserDto);
    if (!isUpdated) {
      throw new BadRequestException({ error: 'No changes were made!' });
    }

    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  async changeUserCurrencyId(userId: number, currencyId: number): Promise<boolean> {
    if (isNaN(userId) || isNaN(currencyId)) {
      throw new BadRequestException({ error: 'Invalid ID!' });
    }

    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException({ error: 'User not found!' });
    }

    if (user.currencyId === currencyId) {
      throw new BadRequestException({ error: 'Invalid currency ID!' });
    }

    await this.currenciesService.getCurrencyById(currencyId);

    user.currencyId = currencyId;
    await this.usersRepository.save(user);
    return true;
  }

  async verifyChanges(user: User, updateUserDto: UpdateUserDto): Promise<boolean> {
    const { name, email } = user;

    if (updateUserDto.name && updateUserDto.name !== name) return true;
    if (updateUserDto.email && updateUserDto.email !== email) return true;

    if (updateUserDto.password) {
      const isSamePassword = await user.validatePassword(updateUserDto.password);
      if (!isSamePassword) return true;
    }

    return false;
  }
}
