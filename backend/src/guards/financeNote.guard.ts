import { CanActivate, ExecutionContext, Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { FinanceNotesService } from '../financeNotes/financeNotes.service';
import { FinanceNote } from '../financeNotes/financeNote.entity';
import { Roles } from 'src/roles/role.entity';

@Injectable()
export class FinanceNoteGuard implements CanActivate {
  constructor(private readonly financeNotesService: FinanceNotesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    const paramId = request.params['financeNoteId'];

    const noteId: number = Number(paramId);
    if (isNaN(noteId)) {
      throw new BadRequestException({ error: 'Invalid note ID!' });
    }

    const note: FinanceNote | null = await this.financeNotesService.getFinanceNoteById(noteId);
    if (!note) {
      throw new NotFoundException({ error: 'Finance-Note not found!' });
    }

    const isAdmin: boolean = user.roleName === Roles.ADMIN;
    const isOwner: boolean = note.userId === user.id;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException({ error: 'You do not have permission!' });
    }

    request.financeNote = note;
    return true;
  }
}
