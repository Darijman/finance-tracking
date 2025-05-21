import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinanceNote } from './financeNote.entity';
import { CreateFinanceNoteDto } from './createFinanceNote.dto';
import { UpdateFinanceNoteDto } from './updateFinanceNote.dto';
import { UsersService } from 'src/users/users.service';
import { plainToInstance } from 'class-transformer';
import { RedisService } from 'src/common/redis/redis.service';

export const getUserFinanceNotesCacheKey = (userId: number) => `userFinanceNotes_${userId}`;

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

  async getFinanceNoteById(id: number): Promise<FinanceNote> {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID!' });
    }

    const note = await this.notesRepository.findOneBy({ id });
    if (!note) {
      throw new NotFoundException({ error: 'Note not found!' });
    }

    return note;
  }

  async getFinanceNotesByUserId(userId: number, limit?: number): Promise<FinanceNote[]> {
    if (isNaN(userId)) {
      throw new BadRequestException({ error: 'Invalid user ID!' });
    }

    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new NotFoundException({ error: 'User not found!' });
    }

    const userCacheKey: string = getUserFinanceNotesCacheKey(userId);
    const cachedUserNotes: string = await this.redisService.getValue(userCacheKey);

    if (cachedUserNotes) {
      const parsedNotes = JSON.parse(cachedUserNotes);
      return limit ? parsedNotes.slice(0, limit) : parsedNotes;
    }

    const userNotes = await this.notesRepository.find({
      where: { userId },
      relations: ['category', 'user', 'user.currency'],
      order: {
        noteDate: 'DESC',
      },
      take: limit ? limit : undefined,
    });

    const transformedNotes = plainToInstance(FinanceNote, userNotes);

    if (transformedNotes.length) {
      await this.redisService.setValue(userCacheKey, JSON.stringify(transformedNotes), 300); // 5min
    }
    return transformedNotes;
  }

  async createNewFinanceNote(createFinanceNoteDto: CreateFinanceNoteDto): Promise<FinanceNote> {
    const { userId } = createFinanceNoteDto;

    const existingUser = await this.usersService.getUserById(userId);
    if (!existingUser) {
      throw new NotFoundException({ error: 'User not found!' });
    }

    const newNote = this.notesRepository.create(createFinanceNoteDto);
    const createdNote = await this.notesRepository.save(newNote);

    const userCacheKey = getUserFinanceNotesCacheKey(userId);
    await this.redisService.deleteValue(userCacheKey);
    return createdNote;
  }

  async deleteFinanceNoteById(id: number): Promise<FinanceNote> {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID!' });
    }

    const note = await this.notesRepository.findOneBy({ id });
    if (!note) {
      throw new NotFoundException({ error: 'Note not found!' });
    }

    const userCacheKey = getUserFinanceNotesCacheKey(note.userId);
    await this.notesRepository.delete(id);
    await this.redisService.deleteValue(userCacheKey);
    return note;
  }

  async updateFinanceNoteById(id: number, updateFinanceNoteDto: UpdateFinanceNoteDto): Promise<FinanceNote> {
    if (isNaN(id)) {
      throw new BadRequestException({ error: 'Invalid ID!' });
    }

    const note = await this.notesRepository.findOneBy({ id });
    if (!note) {
      throw new NotFoundException({ error: 'Note not found!' });
    }

    const isUpdated = this.verifyChanges(note, updateFinanceNoteDto);
    if (!isUpdated) {
      throw new BadRequestException({ error: 'No changes were made!' });
    }

    Object.assign(note, updateFinanceNoteDto);
    const updatedNote = await this.notesRepository.save(note);

    const userCacheKey = getUserFinanceNotesCacheKey(note.userId);
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
