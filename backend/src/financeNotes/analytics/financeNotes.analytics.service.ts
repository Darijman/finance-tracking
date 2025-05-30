import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinanceNote } from '../financeNote.entity';
import { UsersService } from 'src/users/users.service';
import { GetCategoriesExpensesByUserId } from './interfaces';

@Injectable()
export class FinanceNotesAnalyticsService {
  constructor(
    @InjectRepository(FinanceNote)
    private notesRepository: Repository<FinanceNote>,
    private readonly usersService: UsersService,
  ) {}

  // CATEGORIES EXPENSES FOR SELECTED DATE OR ALL TIME - TOTAL
  async getCategoriesExpensesByUserId(
    userId: number,
    options: { year?: number; month?: number } = {},
  ): Promise<GetCategoriesExpensesByUserId[]> {
    if (isNaN(userId)) {
      throw new BadRequestException({ error: 'Invalid user ID!' });
    }

    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new NotFoundException({ error: 'User not found!' });
    }

    const { year, month } = options;

    let start: Date | undefined;
    let end: Date | undefined;

    if (year !== undefined && month !== undefined) {
      if (month < 1 || month > 12) {
        throw new BadRequestException({ error: 'Invalid month! Must be from 1 to 12.' });
      }
      start = new Date(year, month - 1, 1);
      end = new Date(year, month, 0, 23, 59, 59, 999);
    }

    const query = this.notesRepository
      .createQueryBuilder('note')
      .leftJoin('note.category', 'category')
      .select('category.id', 'categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('category.image', 'categoryImage')
      .addSelect('SUM(note.amount)', 'totalExpense')
      .where('note.userId = :userId', { userId })
      .andWhere('note.type = :type', { type: 'EXPENSE' });

    if (start && end) {
      query.andWhere('note.noteDate BETWEEN :start AND :end', { start, end });
    }

    const rawExpenses = await query
      .groupBy('category.id')
      .addGroupBy('category.name')
      .addGroupBy('category.image')
      .orderBy('totalExpense', 'DESC')
      .getRawMany();

    return rawExpenses.map((row) => ({
      category: {
        id: row.categoryId,
        name: row.categoryName,
        image: row.categoryImage,
      },
      totalExpense: parseFloat(row.totalExpense),
    }));
  }
}
