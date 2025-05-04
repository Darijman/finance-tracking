import { Controller, Get, Param, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import { ParseInterceptor } from '../parseInterceptor';
import { AuthGuard } from 'src/auth/auth.guard';
import { FinanceNotesSummaryService } from './financeNotes.summary.service';
import { GetFinanceNotesSummaryByUserId } from './interfaces';

@Controller('finance_notes_summary')
@UseInterceptors(ParseInterceptor)
export class FinanceNotesSummaryController {
  constructor(private readonly financeNotesSummaryService: FinanceNotesSummaryService) {}

  // MONTHS AND YEARS WITH NOTES
  @UseGuards(AuthGuard)
  @Get('/months/:userId')
  async getMonthsWithNotesByUserId(@Param('userId') userId: number): Promise<{ month: number; year: number }[]> {
    return this.financeNotesSummaryService.getMonthsWithNotesByUserId(userId);
  }

  // SUMMARY BY YEAR, MONTH
  @UseGuards(AuthGuard)
  @Get('/:userId')
  async getFinanceNotesSummaryByUserId(
    @Param('userId') userId: number,
    @Query('year') year?: number,
    @Query('month') month?: number,
  ): Promise<GetFinanceNotesSummaryByUserId> {
    return this.financeNotesSummaryService.getFinanceNotesSummaryByUserId(userId, year, month);
  }

  // SUMMARY ALL TIME
  @UseGuards(AuthGuard)
  @Get('/all-time/:userId')
  async getFinanceNotesSummaryAllTimeByUserId(@Param('userId') userId: number) {
    return this.financeNotesSummaryService.getFinanceNotesSummaryAllTimeByUserId(userId);
  }

  // EVERY MONTH INCOME & EXPENSE - TOTAL
  @UseGuards(AuthGuard)
  @Get('/monthly/:userId')
  async getEveryMonthSummaryByUserId(@Param('userId') userId: number): Promise<
    {
      monthRaw: string;
      monthLabel: string;
      income: number;
      expense: number;
    }[]
  > {
    return this.financeNotesSummaryService.getEveryMonthSummaryByUserId(userId);
  }
}
