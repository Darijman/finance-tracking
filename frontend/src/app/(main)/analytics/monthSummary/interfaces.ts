import { FinanceNote } from '@/interfaces/financeNote';

export interface AvailableDate {
  month: number;
  year: number;
}

export interface IMonthSummary {
  incomeTotal: number;
  expenseTotal: number;
  balance: number;
  recentNotes: FinanceNote[];
  noteCount: number;
}
