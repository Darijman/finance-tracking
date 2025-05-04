import { FinanceNote } from '../financeNote.entity';

export interface GetFinanceNotesSummaryByUserId {
  incomeTotal: number;
  expenseTotal: number;
  balance: number;
  recentNotes: FinanceNote[];
  noteCount: number;
}

export interface GetMonthlySummaryByUserId {
  monthRaw: string;
  monthLabel: string;
  income: number;
  expense: number;
}
