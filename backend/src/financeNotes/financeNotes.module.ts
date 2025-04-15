import { Module } from '@nestjs/common';
import { FinanceNotesController } from './financeNotes.controller';
import { FinanceNotesService } from './financeNotes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceNote } from './financeNote.entity';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { RedisModule } from 'src/common/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([FinanceNote]), UsersModule, JwtModule, AuthModule, RedisModule],
  controllers: [FinanceNotesController],
  providers: [FinanceNotesService],
})
export class FinanceNotesModule {}
