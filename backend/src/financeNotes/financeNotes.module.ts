import { Module } from '@nestjs/common';
import { FinanceNotesController } from './financeNotes.controller';
import { FinanceNotesService } from './financeNotes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceNote } from './financeNote.entity';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { RedisModule } from 'src/common/redis/redis.module';
import { FinanceNotesSummaryService } from './summary/financeNotes.summary.service';
import { FinanceNotesAnalyticsService } from './analytics/financeNotes.analytics.service';
import { FinanceNotesAnalyticsController } from './analytics/financeNotes.analytics.controller';
import { FinanceNotesSummaryController } from './summary/financeNotes.summary.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FinanceNote]), UsersModule, JwtModule, AuthModule, RedisModule],
  controllers: [FinanceNotesController, FinanceNotesSummaryController, FinanceNotesAnalyticsController],
  providers: [FinanceNotesService, FinanceNotesSummaryService, FinanceNotesAnalyticsService],
})
export class FinanceNotesModule {}
