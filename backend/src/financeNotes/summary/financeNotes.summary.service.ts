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
      .select(['EXTRACT(YEAR FROM note.noteDate) AS year', 'EXTRACT(MONTH FROM note.noteDate) AS month'])
      .where('note.userId = :userId', { userId })
      .groupBy('year')
      .addGroupBy('month')
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

    const results = await this.notesRepository
      .createQueryBuilder('note')
      .select('note.type', 'type')
      .addSelect('SUM(note.amount)', 'total')
      .addSelect('COUNT(*)', 'count')
      .where('note.userId = :userId', { userId })
      .andWhere('note.noteDate >= :start AND note.noteDate < :end', { start, end })
      .groupBy('note.type')
      .getRawMany();

    // Инициализируем переменные с нулями
    let incomeTotal = 0;
    let expenseTotal = 0;
    let noteCount = 0;

    // Обрабатываем результаты, заполняя суммы и счетчики
    for (const row of results) {
      const total = Number(row.total) || 0;
      const count = Number(row.count) || 0;

      if (row.type === 'INCOME') {
        incomeTotal = total;
        noteCount += count;
      } else if (row.type === 'EXPENSE') {
        expenseTotal = total;
        noteCount += count;
      }
    }

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
        "SUM(CASE WHEN note.type = 'INCOME' THEN note.amount ELSE 0 END) AS income",
        "SUM(CASE WHEN note.type = 'EXPENSE' THEN note.amount ELSE 0 END) AS expense",
      ])
      .where('note.userId = :userId', { userId })
      .groupBy('monthRaw')
      .orderBy('monthRaw', 'ASC')
      .getRawMany();

    return result.map((row) => ({
      monthRaw: row.monthRaw,
      monthLabel: new Date(row.monthRaw + '-01').toLocaleString('default', { year: 'numeric', month: 'long' }),
      income: parseFloat(row.income),
      expense: parseFloat(row.expense),
    }));
  }
}
