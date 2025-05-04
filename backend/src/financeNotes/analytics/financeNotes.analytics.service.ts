import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinanceNote } from '../financeNote.entity';
import { UsersService } from 'src/users/users.service';
import { RedisService } from 'src/common/redis/redis.service';
import { GetCategoriesExpensesByUserId } from './interfaces';

// const getUserFinanceNotesCacheKey = (userId: number) => `userFinanceNotes_${userId}`;

@Injectable()
export class FinanceNotesAnalyticsService {
  constructor(
    @InjectRepository(FinanceNote)
    private notesRepository: Repository<FinanceNote>,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
  ) {}

  // CATEGORIES EXPENSES FOR CURRENT MONTH OR ALL TIME - TOTAL
  async getCategoriesExpensesByUserId(userId: number, period: 'month' | 'all' = 'month'): Promise<GetCategoriesExpensesByUserId[]> {
    if (isNaN(userId)) {
      throw new BadRequestException({ error: 'Invalid user ID!' });
    }

    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new NotFoundException({ error: 'User not found!' });
    }

    let start: Date | undefined;
    let end: Date | undefined;

    if (period === 'month') {
      const now = new Date();
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
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

    if (period === 'month') {
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
