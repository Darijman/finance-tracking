import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsModule } from './transactions/transactions.module';
import { Transaction } from './transactions/transaction.entity';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import * as redisStore from 'cache-manager-redis-store';
import { AuthModule } from './auth/auth.module';

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
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 300, // 5 минут (в секундах)
      isGlobal: true, // ✅ Делаем доступным во всех модулях
    }),
    TransactionsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
