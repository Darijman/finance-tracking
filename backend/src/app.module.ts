import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceNotesModule } from './financeNotes/financeNotes.module';
import { FinanceCategoriesModule } from './financeCategories/financeCategories.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { FinanceNote } from './financeNotes/financeNote.entity';
import { FinanceCategory } from './financeCategories/financeCategory.entity';
import { User } from './users/user.entity';
import { Role } from './roles/role.entity';
import { RedisModule } from './common/redis/redis.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { Currency } from './currencies/currency.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456789',
      database: 'finance-tracking',
      entities: [FinanceNote, FinanceCategory, User, Role, Currency],
      synchronize: false,
      timezone: 'Z',
    }),
    FinanceNotesModule,
    FinanceCategoriesModule,
    UsersModule,
    AuthModule,
    RolesModule,
    RedisModule,
    CurrenciesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
