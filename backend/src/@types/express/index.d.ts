import 'express';
import { FinanceCategory } from 'src/financeCategories/financeCategory.entity';
import { FinanceNote } from 'src/financeNotes/financeNote.entity';

declare module 'express' {
  export interface Request {
    user: {
      id: number;
      name: string;
      roleId: number;
      roleName: string;
    };
    financeNote?: FinanceNote;
    financeCategory?: FinanceCategory;
  }
}
