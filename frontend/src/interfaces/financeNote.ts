import { FinanceCategory } from './financeCategory';

export enum Categories {
  'FOOD' = 'FOOD',
  'TRANSPORT' = 'TRANSPORT',
  'ENTERTAINMENT' = 'ENTERTAINMENT',
  'CLOTHES' = 'CLOTHES',
  'HEALTH' = 'HEALTH',
  'DIFFERENT' = 'DIFFERENT',
}

export enum NoteType {
  'INCOME' = 'INCOME',
  'EXPENSE' = 'EXPENSE',
}

export interface FinanceNote {
  id: number;
  noteDate: string;
  amount: number;
  type: NoteType;
  category: FinanceCategory;
  comment?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}
