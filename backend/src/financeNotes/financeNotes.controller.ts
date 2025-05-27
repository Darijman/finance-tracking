import { Controller, Get, Post, Delete, Put, Body, Param, UseInterceptors, UseGuards, Query, Req } from '@nestjs/common';
import { FinanceNotesService } from './financeNotes.service';
import { CreateFinanceNoteDto } from './createFinanceNote.dto';
import { UpdateFinanceNoteDto } from './updateFinanceNote.dto';
import { ParseInterceptor } from './parseInterceptor';
import { Admin } from 'src/auth/auth.decorators';
import { FinanceNote } from './financeNote.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { FinanceNoteGuard } from '../guards/financeNote.guard';
import { OwnerOrAdminGuard } from 'src/guards/ownerOrAdmin.guard';

@Controller('finance_notes')
@UseInterceptors(ParseInterceptor)
export class FinanceNotesController {
  constructor(private readonly financeNotesService: FinanceNotesService) {}

  @Admin()
  @Get()
  async getAllFinanceNotes(): Promise<FinanceNote[]> {
    return await this.financeNotesService.getAllFinanceNotes();
  }

  @UseGuards(AuthGuard, OwnerOrAdminGuard)
  @Get('user/:userId')
  async getFinanceNotesByUserId(@Param('userId') userId: number, @Query('limit') limit?: number): Promise<FinanceNote[]> {
    return await this.financeNotesService.getFinanceNotesByUserId(userId, limit);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createNewFinanceNote(@Body() createNoteDto: CreateFinanceNoteDto, @Req() req: Request): Promise<FinanceNote> {
    return await this.financeNotesService.createNewFinanceNote(createNoteDto, req.user.id);
  }

  @UseGuards(AuthGuard, FinanceNoteGuard)
  @Get(':financeNoteId')
  async getFinanceNoteById(@Req() req: Request): Promise<FinanceNote> {
    return req.financeNote;
  }

  @UseGuards(AuthGuard, FinanceNoteGuard)
  @Delete(':financeNoteId')
  async deleteFinanceNote(@Req() req: Request): Promise<FinanceNote> {
    return await this.financeNotesService.deleteFinanceNote(req.financeNote);
  }

  @UseGuards(AuthGuard, FinanceNoteGuard)
  @Put(':financeNoteId')
  async updateFinanceNote(@Req() req: Request, @Body() updateNoteDto: UpdateFinanceNoteDto): Promise<FinanceNote> {
    return await this.financeNotesService.updateFinanceNote(req.financeNote, updateNoteDto);
  }
}
