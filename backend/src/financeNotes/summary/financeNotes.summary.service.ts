import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinanceNote } from '../financeNote.entity';
import { GetFinanceNotesSummaryByUserId, GetMonthlySummaryByUserId } from './interfaces';

@Injectable()
export class FinanceNotesSummaryService {
  constructor(
    @InjectRepository(FinanceNote)
    private notesRepository: Repository<FinanceNote>,
  ) {}

  // MONTHS AND YEARS WITH NOTES
  async getMonthsWithNotesByUserId(userId: number): Promise<{ month: number; year: number }[]> {
    if (isNaN(userId)) {
      throw new BadRequestException({ error: 'Invalid user ID!' });
    }

    const results = await this.notesRepository
      .createQueryBuilder('note')
      .select(['DISTINCT EXTRACT(MONTH FROM note.noteDate) AS month', 'EXTRACT(YEAR FROM note.noteDate) AS year'])
      .where('note.userId = :userId', { userId })
      .orderBy('year', 'DESC')
      .addOrderBy('month', 'DESC')
      .getRawMany();

    return results.map((r) => ({
      month: Number(r.month),
      year: Number(r.year),
    }));
  }

  // SUMMARY BY YEAR, MONTH
  async getFinanceNotesSummaryByUserId(userId: number, year?: number, month?: number): Promise<GetFinanceNotesSummaryByUserId> {
    if (isNaN(userId)) {
      throw new BadRequestException({ error: 'Invalid user ID!' });
    }

    const now = new Date();
    const targetYear = year ?? now.getFullYear();
    const targetMonth = month ?? now.getMonth() + 1;

    const start = new Date(targetYear, targetMonth - 1, 1);
    const end = new Date(targetYear, targetMonth, 1);

    const [incomeTotalResult, expenseTotalResult, noteCountResult] = await Promise.all([
      this.notesRepository
        .createQueryBuilder('note')
        .select('SUM(note.amount)', 'total')
        .where('note.userId = :userId', { userId })
        .andWhere('note.type = :type', { type: 'INCOME' })
        .andWhere('note.noteDate >= :start AND note.noteDate < :end', { start, end })
        .getRawOne(),

      this.notesRepository
        .createQueryBuilder('note')
        .select('SUM(note.amount)', 'total')
        .where('note.userId = :userId', { userId })
        .andWhere('note.type = :type', { type: 'EXPENSE' })
        .andWhere('note.noteDate >= :start AND note.noteDate < :end', { start, end })
        .getRawOne(),

      this.notesRepository
        .createQueryBuilder('note')
        .select('COUNT(*)', 'count')
        .where('note.userId = :userId', { userId })
        .andWhere('note.noteDate >= :start AND note.noteDate < :end', { start, end })
        .getRawOne(),
    ]);

    const incomeTotal = Number(incomeTotalResult?.total) || 0;
    const expenseTotal = Number(expenseTotalResult?.total) || 0;
    const noteCount = Number(noteCountResult?.count) || 0;

    return {
      incomeTotal,
      expenseTotal,
      balance: incomeTotal - expenseTotal,
      noteCount,
    };
  }

  // SUMMARY ALL TIME
  async getFinanceNotesSummaryAllTimeByUserId(userId: number): Promise<GetFinanceNotesSummaryByUserId> {
    if (isNaN(userId)) {
      throw new BadRequestException({ error: 'Invalid user ID!' });
    }

    const [incomeTotalResult, expenseTotalResult, noteCountResult] = await Promise.all([
      this.notesRepository
        .createQueryBuilder('note')
        .select('SUM(note.amount)', 'total')
        .where('note.userId = :userId', { userId })
        .andWhere('note.type = :type', { type: 'INCOME' })
        .getRawOne(),

      this.notesRepository
        .createQueryBuilder('note')
        .select('SUM(note.amount)', 'total')
        .where('note.userId = :userId', { userId })
        .andWhere('note.type = :type', { type: 'EXPENSE' })
        .getRawOne(),

      this.notesRepository.createQueryBuilder('note').select('COUNT(*)', 'count').where('note.userId = :userId', { userId }).getRawOne(),
    ]);

    const incomeTotal = Number(incomeTotalResult?.total) || 0;
    const expenseTotal = Number(expenseTotalResult?.total) || 0;
    const noteCount = Number(noteCountResult?.count) || 0;

    return {
      incomeTotal,
      expenseTotal,
      balance: incomeTotal - expenseTotal,
      noteCount,
    };
  }

  // EVERY MONTH INCOME & EXPENSE - TOTAL
  async getEveryMonthSummaryByUserId(userId: number): Promise<GetMonthlySummaryByUserId[]> {
    if (isNaN(userId)) {
      throw new BadRequestException({ error: 'Invalid user ID!' });
    }

    const result = await this.notesRepository
      .createQueryBuilder('note')
      .select([
        "DATE_FORMAT(note.noteDate, '%Y-%m') AS monthRaw",
        "DATE_FORMAT(note.noteDate, '%Y-%M') AS monthLabel",
        "SUM(CASE WHEN note.type = 'INCOME' THEN note.amount ELSE 0 END) AS income",
        "SUM(CASE WHEN note.type = 'EXPENSE' THEN note.amount ELSE 0 END) AS expense",
      ])
      .where('note.userId = :userId', { userId })
      .groupBy("DATE_FORMAT(note.noteDate, '%Y-%m'), DATE_FORMAT(note.noteDate, '%Y-%M')")
      .orderBy('monthRaw', 'ASC')
      .getRawMany();

    return result.map((row) => ({
      monthRaw: row.monthRaw,
      monthLabel: row.monthLabel,
      income: parseFloat(row.income),
      expense: parseFloat(row.expense),
    }));
  }
}
