import { CanActivate, ExecutionContext, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { FinanceNotesService } from '../financeNotes/financeNotes.service';
import { FinanceNote } from '../financeNotes/financeNote.entity';

@Injectable()
export class FinanceNoteGuard implements CanActivate {
  constructor(private readonly financeNotesService: FinanceNotesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as { id: number; roleName: 'ADMIN' | 'USER' };
    const paramId = request.params['financeNoteId'];

    const noteId: number = Number(paramId);
    if (isNaN(noteId)) {
      throw new ForbiddenException({ error: 'Invalid note ID!' });
    }

    const note: FinanceNote | null = await this.financeNotesService.getFinanceNoteById(noteId);
    if (!note) {
      throw new NotFoundException({ error: 'Note not found!' });
    }

    const isAdmin: boolean = user.roleName === 'ADMIN';
    const isOwner: boolean = note.userId === user.id;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException({ error: 'You do not have permission!' });
    }

    (request as any).financeNote = note;
    return true;
  }
}
