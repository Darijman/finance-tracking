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
import { FinanceCategoriesService } from './financeCategories.service';
import { CreateFinanceCategoryDto } from './createFinanceCategory.dto';
import { UpdateFinanceCategoryDto } from './updateFinanceCategory.dto';
import { Public } from 'src/auth/auth.decorators';
import { FinanceCategory } from './financeCategory.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from 'src/users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/common/multer/multer.config';

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

  @Public()
  // @UseGuards(AuthGuard)
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
      throw new BadRequestException('Image file is required');
    }

    createFinanceCategoryDto.image = image.filename;
    return await this.financeCategoriesService.createNewFinanceCategory(createFinanceCategoryDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getFinanceCategoryById(@Param('id') id: number, @Request() req: any): Promise<FinanceCategory> {
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
  async getFinanceCategoriesByUserId(@Param('userId') userId: number, @Request() req: any): Promise<FinanceCategory[]> {
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
  @Delete(':id')
  async deleteFinanceCategoryById(@Param('id') id: number): Promise<FinanceCategory> {
    return await this.financeCategoriesService.deleteFinanceCategoryById(id);
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
