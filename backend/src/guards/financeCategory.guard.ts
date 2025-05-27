import { CanActivate, ExecutionContext, Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { FinanceCategoriesService } from 'src/financeCategories/financeCategories.service';
import { FinanceCategory } from 'src/financeCategories/financeCategory.entity';

@Injectable()
export class FinanceCategoryGuard implements CanActivate {
  constructor(private readonly financeCategoriesService: FinanceCategoriesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    const paramId = request.params['financeCategoryId'];

    const categoryId: number = Number(paramId);
    if (isNaN(categoryId)) {
      throw new BadRequestException({ error: 'Invalid category ID!' });
    }

    const category: FinanceCategory | null = await this.financeCategoriesService.getFinanceCategoryById(categoryId);
    if (!category) {
      throw new NotFoundException({ error: 'Finance-Category not found!' });
    }

    const isAdmin: boolean = user.roleName === 'ADMIN';
    const isOwner: boolean = category.userId === user.id;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException({ error: 'You do not have permission!' });
    }

    request.financeCategory = category;
    return true;
  }
}
