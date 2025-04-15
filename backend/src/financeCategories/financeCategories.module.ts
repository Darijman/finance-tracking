import { Module } from '@nestjs/common';
import { FinanceCategoriesController } from './financeCategories.controller';
import { FinanceCategoriesService } from './financeCategories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceCategory } from './financeCategory.entity';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { RedisModule } from 'src/common/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([FinanceCategory]), UsersModule, JwtModule, AuthModule, RedisModule, MulterModule],
  controllers: [FinanceCategoriesController],
  providers: [FinanceCategoriesService],
})
export class FinanceCategoriesModule {}
