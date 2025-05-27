import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { RolesModule } from 'src/roles/roles.module';
import { CurrenciesModule } from 'src/currencies/currencies.module';
import { RedisModule } from 'src/common/redis/redis.module';
import { FinanceNote } from 'src/financeNotes/financeNote.entity';
import { FinanceCategory } from 'src/financeCategories/financeCategory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, FinanceNote, FinanceCategory]),
    AuthModule,
    RolesModule,
    RedisModule,
    forwardRef(() => CurrenciesModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
