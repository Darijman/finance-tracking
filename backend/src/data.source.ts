import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { FinanceNote } from './financeNotes/financeNote.entity';
import { FinanceCategory } from './financeCategories/financeCategory.entity';
import { User } from './users/user.entity';
import { Role } from './roles/role.entity';
import { Currency } from './currencies/currency.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456789',
  database: 'finance-tracking',
  entities: [FinanceNote, FinanceCategory, User, Role, Currency],
  synchronize: false,
});
