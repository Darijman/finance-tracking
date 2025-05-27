import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { Request } from 'express';
import { FinanceCategoriesService } from './financeCategories.service';
import { CreateFinanceCategoryDto } from './createFinanceCategory.dto';
import { UpdateFinanceCategoryDto } from './updateFinanceCategory.dto';
import { Admin } from 'src/auth/auth.decorators';
import { FinanceCategory } from './financeCategory.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/common/multer/multer.config';
import { CreateUserFinanceCategoryDto } from './createUserFinanceCategory.dto';
import { FinanceCategoryGuard } from 'src/guards/financeCategory.guard';
import { OwnerOrAdminGuard } from 'src/guards/ownerOrAdmin.guard';

@Controller('finance_categories')
export class FinanceCategoriesController {
  constructor(private readonly financeCategoriesService: FinanceCategoriesService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllFinanceCategories(): Promise<FinanceCategory[]> {
    return await this.financeCategoriesService.getAllFinanceCategories();
  }

  @UseGuards(AuthGuard)
  @Post('user')
  async createNewUserFinanceCategory(
    @Body() createUserFinanceCategoryDto: CreateUserFinanceCategoryDto,
    @Req() req: Request,
  ): Promise<FinanceCategory> {
    return await this.financeCategoriesService.createNewUserFinanceCategory(createUserFinanceCategoryDto, req.user.id);
  }

  @UseGuards(AuthGuard, OwnerOrAdminGuard)
  @Get('combined/:userId')
  async getCombinedFinanceCategories(@Param('userId') userId: number): Promise<FinanceCategory[]> {
    return this.financeCategoriesService.getCombinedFinanceCategories(userId);
  }

  @UseGuards(AuthGuard, OwnerOrAdminGuard)
  @Get('user/:userId')
  async getOnlyUserCategories(@Param('userId') userId: number): Promise<FinanceCategory[]> {
    return this.financeCategoriesService.getOnlyUserCategories(userId);
  }

  @Admin()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @Post()
  async createNewFinanceCategory(
    @Body() createFinanceCategoryDto: CreateFinanceCategoryDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() req: any,
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

  @UseGuards(AuthGuard, FinanceCategoryGuard)
  @Get(':financeCategoryId')
  async getFinanceCategoryById(@Req() req: Request): Promise<FinanceCategory> {
    return req.financeCategory;
  }

  @UseGuards(AuthGuard, FinanceCategoryGuard)
  @Delete(':financeCategoryId')
  async deleteFinanceCategory(@Req() req: Request): Promise<FinanceCategory> {
    return await this.financeCategoriesService.deleteFinanceCategory(req.financeCategory);
  }

  @UseGuards(AuthGuard, FinanceCategoryGuard)
  @Put(':financeCategoryId')
  async updateFinanceCategoryById(@Body() updateFinanceCategoryDto: UpdateFinanceCategoryDto, @Req() req: Request): Promise<FinanceCategory> {
    return await this.financeCategoriesService.updateFinanceCategoryById(req.financeCategory, updateFinanceCategoryDto);
  }
}
