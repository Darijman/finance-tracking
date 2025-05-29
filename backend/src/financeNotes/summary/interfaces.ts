export interface GetFinanceNotesSummaryByUserId {
  incomeTotal: number;
  expenseTotal: number;
  balance: number;
  noteCount: number;
}

export interface GetMonthlySummaryByUserId {
  monthRaw: string;
  monthLabel: string;
  income: number;
  expense: number;
}
