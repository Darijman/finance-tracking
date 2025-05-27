import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const paramUserId: number = Number(request.params.userId);
    if (isNaN(paramUserId)) {
      throw new BadRequestException({ error: 'Invalid ID!' });
    }

    const isAdmin: boolean = user.roleName === 'ADMIN';
    const isOwner: boolean = user.id === paramUserId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException({ error: 'You do not have permission!' });
    }

    return true;
  }
}
