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
    const MAX_LIMIT: number = 100;
    const { offset = 0, limit = 20, categoryId, type, sortByDate = 'DESC', sortByPrice } = query;

    if (limit > MAX_LIMIT) {
      throw new BadRequestException({ error: 'Limit exceeded!' });
    }

    await this.usersService.getUserById(userId);
    const baseQb = this.notesRepository
      .createQueryBuilder('note')
      .select(['note.id'])
      .where('note.userId = :userId', { userId })
      .skip(offset)
      .take(limit);

    if (categoryId) baseQb.andWhere('note.categoryId = :categoryId', { categoryId });
    if (type) baseQb.andWhere('note.type = :type', { type });
    if (sortByPrice) {
      baseQb.orderBy('note.amount', sortByPrice);
    }
    baseQb.orderBy('note.noteDate', sortByDate).addOrderBy('note.id', 'ASC');

    const idsWithOrder = await baseQb.getRawMany<{ note_id: number }>();
    const ids = idsWithOrder.map((row) => row.note_id);
    if (!ids.length) return [];

    const finalQb = this.notesRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.category', 'category')
      .leftJoinAndSelect('note.user', 'user')
      .leftJoinAndSelect('user.currency', 'currency')
      .whereInIds(ids);

    finalQb.orderBy(`FIELD(note.id, ${ids.join(',')})`);
    const notes = await finalQb.getMany();
    return plainToInstance(FinanceNote, notes);
  }

  async getFinanceNotesCountByUserId(userId: number): Promise<{ count: number }> {
    const count = await this.notesRepository.count({ where: { userId } });
    return { count };
  }

  async createNewFinanceNote(createFinanceNoteDto: CreateFinanceNoteDto, currentUserId: number): Promise<FinanceNote> {
    console.time('⏱ CreateNote total');

    console.time('⏱ Save note');
    const createdNote = await this.notesRepository.save({ ...createFinanceNoteDto, userId: currentUserId });
    console.timeEnd('⏱ Save note');

    console.time('⏱ Delete user cache');
    const userCacheKey: string = getUserFinanceNotesCacheKey(currentUserId);
    await this.redisService.deleteValue(userCacheKey);
    console.timeEnd('⏱ Delete user cache');

    console.timeEnd('⏱ CreateNote total');
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
