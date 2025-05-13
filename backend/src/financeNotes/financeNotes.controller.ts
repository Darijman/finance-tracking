import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  UseInterceptors,
  UseGuards,
  Request,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { FinanceNotesService } from './financeNotes.service';
import { CreateFinanceNoteDto } from './createFinanceNote.dto';
import { UpdateFinanceNoteDto } from './updateFinanceNote.dto';
import { ParseInterceptor } from './parseInterceptor';
import { Admin } from 'src/auth/auth.decorators';
import { FinanceNote } from './financeNote.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('finance_notes')
@UseInterceptors(ParseInterceptor)
export class FinanceNotesController {
  constructor(
    private readonly financeNotesService: FinanceNotesService,
    private readonly usersService: UsersService,
  ) {}

  @Admin()
  @Get()
  async getAllFinanceNotes(): Promise<FinanceNote[]> {
    return await this.financeNotesService.getAllFinanceNotes();
  }

  @UseGuards(AuthGuard)
  @Post()
  async createNewFinanceNote(@Body() createNoteDto: CreateFinanceNoteDto): Promise<FinanceNote> {
    return await this.financeNotesService.createNewFinanceNote(createNoteDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getFinanceNoteById(@Param('id') id: number, @Request() req: any): Promise<FinanceNote> {
    const currentUser = await this.usersService.getUserByIdWithRole(req.user.id);
    const note = await this.financeNotesService.getFinanceNoteById(id);
    if (currentUser.role.name === 'ADMIN') {
      return note;
    }

    if (currentUser.id !== note.userId) {
      throw new ForbiddenException({ error: 'You do not have permission!' });
    }

    return note;
  }

  @UseGuards(AuthGuard)
  @Get('user/:userId')
  async getFinanceNotesByUserId(
    @Param('userId') userId: number,
    @Request() req: any,
    @Query('limit') limit?: number,
  ): Promise<FinanceNote[]> {
    const currentUser = await this.usersService.getUserByIdWithRole(req.user.id);
    if (currentUser.role.name === 'ADMIN') {
      return await this.financeNotesService.getFinanceNotesByUserId(userId, limit);
    }

    if (currentUser.id !== userId) {
      throw new ForbiddenException({ error: 'You do not have permission!' });
    }

    return await this.financeNotesService.getFinanceNotesByUserId(userId, limit);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteFinanceNoteById(@Param('id') id: number): Promise<FinanceNote> {
    return await this.financeNotesService.deleteFinanceNoteById(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateFinanceNoteById(@Param('id') id: number, @Body() updateNoteDto: UpdateFinanceNoteDto): Promise<FinanceNote> {
    return await this.financeNotesService.updateFinanceNoteById(id, updateNoteDto);
  }
}
