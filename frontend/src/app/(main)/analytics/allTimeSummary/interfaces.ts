import { FinanceNote } from '@/interfaces/financeNote';

export interface IAllTimeSummary {
  incomeTotal: number;
  expenseTotal: number;
  balance: number;
  recentNotes: FinanceNote[];
  noteCount: number;
}
