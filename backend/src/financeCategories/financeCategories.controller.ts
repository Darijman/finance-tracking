import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { FinanceCategoriesService } from './financeCategories.service';
import { CreateFinanceCategoryDto } from './createFinanceCategory.dto';
import { UpdateFinanceCategoryDto } from './updateFinanceCategory.dto';
import { Admin } from 'src/auth/auth.decorators';
import { FinanceCategory } from './financeCategory.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from 'src/users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/common/multer/multer.config';
import { CreateUserFinanceCategoryDto } from './createUserFinanceCategory.dto';

@Controller('finance_categories')
export class FinanceCategoriesController {
  constructor(
    private readonly financeCategoriesService: FinanceCategoriesService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllFinanceCategories(): Promise<FinanceCategory[]> {
    return await this.financeCategoriesService.getAllFinanceCategories();
  }

  @UseGuards(AuthGuard)
  @Post('user')
  async createNewUserFinanceCategory(
    @Body() createUserFinanceCategoryDto: CreateUserFinanceCategoryDto,
    @Request() req: ExpressRequest,
  ): Promise<FinanceCategory> {
    return await this.financeCategoriesService.createNewUserFinanceCategory(createUserFinanceCategoryDto, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('combined')
  async getCombinedFinanceCategories(@Request() req: ExpressRequest): Promise<FinanceCategory[]> {
    return this.financeCategoriesService.getCombinedFinanceCategories(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async getOnlyUserCategories(@Request() req: ExpressRequest): Promise<FinanceCategory[]> {
    return this.financeCategoriesService.getOnlyUserCategories(req.user.id);
  }

  @Admin()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @Post()
  async createNewFinanceCategory(
    @Body() createFinanceCategoryDto: CreateFinanceCategoryDto,
    @UploadedFile() image: Express.Multer.File,
    @Request() req: any,
  ): Promise<FinanceCategory> {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }

    if (!image) {
      throw new BadRequestException({ error: 'Image file is required' });
    }

    createFinanceCategoryDto.image = image.filename;
    return await this.financeCategoriesService.createNewFinanceCategory(createFinanceCategoryDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getFinanceCategoryById(@Param('id') id: number, @Request() req: ExpressRequest): Promise<FinanceCategory> {
    const currentUser = await this.usersService.getUserByIdWithRole(req.user.id);
    const financeCategory = await this.financeCategoriesService.getFinanceCategoryById(id);
    if (currentUser.role.name === 'ADMIN') {
      return financeCategory;
    }

    if (currentUser.id !== financeCategory.userId) {
      throw new ForbiddenException({ error: 'You do not have permission!' });
    }

    return financeCategory;
  }

  @UseGuards(AuthGuard)
  @Get('user/:userId')
  async getFinanceCategoriesByUserId(@Param('userId') userId: number, @Request() req: ExpressRequest): Promise<FinanceCategory[]> {
    const currentUser = await this.usersService.getUserByIdWithRole(req.user.id);
    if (currentUser.role.name === 'ADMIN') {
      return await this.financeCategoriesService.getFinanceCategoriesByUserId(userId);
    }

    if (currentUser.id !== userId) {
      throw new ForbiddenException({ error: 'You do not have permission!' });
    }

    return await this.financeCategoriesService.getFinanceCategoriesByUserId(userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':financeCategoryId')
  async deleteFinanceCategoryById(
    @Param('financeCategoryId') financeCategoryId: number,
    @Request() req: ExpressRequest,
  ): Promise<FinanceCategory> {
    return await this.financeCategoriesService.deleteFinanceCategoryById(financeCategoryId, req.user.id, req.user.roleId);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateFinanceCategoryById(
    @Param('id') id: number,
    @Body() updateFinanceCategoryDto: UpdateFinanceCategoryDto,
  ): Promise<FinanceCategory> {
    return await this.financeCategoriesService.updateFinanceCategoryById(id, updateFinanceCategoryDto);
  }
}
