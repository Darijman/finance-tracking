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
import { RolesModule } from 'src/roles/roles.module';
import { FinanceNotesModule } from 'src/financeNotes/financeNotes.module';
import { FinanceNote } from 'src/financeNotes/financeNote.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FinanceCategory, FinanceNote]),
    UsersModule,
    JwtModule,
    AuthModule,
    RedisModule,
    MulterModule,
    RolesModule,
    FinanceNotesModule,
  ],
  controllers: [FinanceCategoriesController],
  providers: [FinanceCategoriesService],
})
export class FinanceCategoriesModule {}
