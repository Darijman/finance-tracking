import { Controller, Get, Param, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import { ParseInterceptor } from '../parseInterceptor';
import { AuthGuard } from 'src/auth/auth.guard';
import { FinanceNotesAnalyticsService } from './financeNotes.analytics.service';
import { GetCategoriesExpensesByUserId } from './interfaces';
import { OwnerOrAdminGuard } from 'src/guards/ownerOrAdmin.guard';

@Controller('finance_notes_analytics')
@UseInterceptors(ParseInterceptor)
export class FinanceNotesAnalyticsController {
  constructor(private readonly financeNotesAnalyticsService: FinanceNotesAnalyticsService) {}

  // CATEGORIES EXPENSES FOR SELECTED DATE OR ALL TIME - TOTAL
  @UseGuards(AuthGuard, OwnerOrAdminGuard)
  @Get('expenses_category/:userId')
  async getCategoriesExpensesByUserId(
    @Param('userId') userId: number,
    @Query('year') year?: number,
    @Query('month') month?: number,
  ): Promise<GetCategoriesExpensesByUserId[]> {
    return this.financeNotesAnalyticsService.getCategoriesExpensesByUserId(userId, { year, month });
  }
}
