import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinanceNote } from './financeNote.entity';
import { CreateFinanceNoteDto } from './createFinanceNote.dto';
import { UpdateFinanceNoteDto } from './updateFinanceNote.dto';
import { UsersService } from 'src/users/users.service';
import { plainToInstance } from 'class-transformer';
import { RedisService } from 'src/common/redis/redis.service';

export const getUserFinanceNotesCacheKey = (userId: number) => `user:${userId}:notes:preview`;

export interface UserFinanceNotesQuery {
  offset?: number;
  limit?: number;
  categoryId?: number | null;
  type?: 'INCOME' | 'EXPENSE' | null;
  sortByDate?: 'ASC' | 'DESC';
  sortByPrice?: 'ASC' | 'DESC' | null;
}

@Injectable()
export class FinanceNotesService {
  constructor(
    @InjectRepository(FinanceNote)
    private notesRepository: Repository<FinanceNote>,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
  ) {}

  async getAllFinanceNotes(): Promise<FinanceNote[]> {
    return await this.notesRepository.find();
  }

  async getFinanceNoteById(financeNoteId: number): Promise<FinanceNote> {
    return await this.notesRepository.findOneBy({ id: financeNoteId });
  }

  async getFinanceNotesByUserId(userId: number, query: UserFinanceNotesQuery): Promise<FinanceNote[]> {
    const { offset = 0, limit = 20, categoryId = null, type = null, sortByDate = 'DESC', sortByPrice = null } = query;
    await this.usersService.getUserById(userId);

    const qb = this.notesRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.category', 'category')
      .leftJoinAndSelect('note.user', 'user')
      .leftJoinAndSelect('user.currency', 'currency')
      .where('note.userId = :userId', { userId });

    if (categoryId) qb.andWhere('category.id = :categoryId', { categoryId });
    if (type) qb.andWhere('note.type = :type', { type });
    if (sortByPrice) {
      qb.addSelect('note.amount * 1.0', 'amount_numeric');
      qb.orderBy('amount_numeric', sortByPrice as 'ASC' | 'DESC');
      qb.addOrderBy('note.noteDate', sortByDate || 'DESC');
    } else {
      qb.orderBy('note.noteDate', sortByDate || 'DESC');
    }

    qb.skip(offset).take(limit);
    const notes = await qb.getMany();
    return plainToInstance(FinanceNote, notes);
  }

  async createNewFinanceNote(createFinanceNoteDto: CreateFinanceNoteDto, currentUserId: number): Promise<FinanceNote> {
    const createdNote = await this.notesRepository.save({ ...createFinanceNoteDto, userId: currentUserId });

    const userCacheKey: string = getUserFinanceNotesCacheKey(currentUserId);
    await this.redisService.deleteValue(userCacheKey);
    return createdNote;
  }

  async deleteFinanceNote(note: FinanceNote): Promise<FinanceNote> {
    const userCacheKey: string = getUserFinanceNotesCacheKey(note.userId);
    await this.redisService.deleteValue(userCacheKey);
    await this.notesRepository.delete(note.id);
    return note;
  }

  async updateFinanceNote(financeNote: FinanceNote, updateFinanceNoteDto: UpdateFinanceNoteDto): Promise<FinanceNote> {
    const isUpdated = this.verifyChanges(financeNote, updateFinanceNoteDto);
    if (!isUpdated) {
      throw new BadRequestException({ error: 'No changes were made!' });
    }

    Object.assign(financeNote, updateFinanceNoteDto);
    const updatedNote = await this.notesRepository.save(financeNote);

    const userCacheKey: string = getUserFinanceNotesCacheKey(financeNote.userId);
    await this.redisService.deleteValue(userCacheKey);
    return updatedNote;
  }

  verifyChanges(note: FinanceNote, newNote: UpdateFinanceNoteDto): boolean {
    let isUpdated: boolean = false;

    if (newNote.amount && newNote.amount !== Number(note.amount)) isUpdated = true;
    if (newNote.categoryId && newNote.categoryId !== note.categoryId) isUpdated = true;
    if (newNote.comment !== undefined && newNote.comment !== null && newNote.comment !== note.comment) isUpdated = true;
    if (newNote.type && newNote.type !== note.type) isUpdated = true;
    if (newNote.noteDate && newNote.noteDate.getTime() !== note.noteDate.getTime()) {
      isUpdated = true;
    }
    return isUpdated;
  }
}
