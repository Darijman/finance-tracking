import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsModule } from './transactions/transactions.module';
import { Transaction } from './transactions/transaction.entity';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456789',
      database: 'finance-tracking',
      entities: [Transaction, User],
      synchronize: true,
      timezone: 'Z',
    }),
    TransactionsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
