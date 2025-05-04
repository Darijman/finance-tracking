import { Controller, Get, Param, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import { ParseInterceptor } from '../parseInterceptor';
import { AuthGuard } from 'src/auth/auth.guard';
import { FinanceNotesAnalyticsService } from './financeNotes.analytics.service';
import { GetCategoriesExpensesByUserId } from './interfaces';

@Controller('finance_notes_analytics')
@UseInterceptors(ParseInterceptor)
export class FinanceNotesAnalyticsController {
  constructor(private readonly financeNotesAnalyticsService: FinanceNotesAnalyticsService) {}

  // CATEGORIES EXPENSES FOR CURRENT MONTH OR ALL TIME - TOTAL
  @UseGuards(AuthGuard)
  @Get('expenses_category/:userId')
  async getCategoriesExpensesByUserId(
    @Param('userId') userId: number,
    @Query('period') period?: 'month' | 'all',
  ): Promise<GetCategoriesExpensesByUserId[]> {
    return this.financeNotesAnalyticsService.getCategoriesExpensesByUserId(userId, period);
  }
}
