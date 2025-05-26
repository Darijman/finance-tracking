import 'express';
import { FinanceNote } from 'src/financeNotes/financeNote.entity';

declare module 'express' {
  export interface Request {
    user: {
      id: number;
      name: string;
      email: string;
      roleName: string;
    };
    financeNote?: FinanceNote;
  }
}
