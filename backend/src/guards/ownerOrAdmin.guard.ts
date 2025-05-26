import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: { id: number; name: string; roleName: string } = request.user;

    const paramUserId = Number(request.params.userId);
    if (isNaN(paramUserId)) {
      throw new ForbiddenException({ error: 'Invalid ID!' });
    }

    const isAdmin = user.roleName === 'ADMIN';
    const isOwner = user.id === paramUserId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException({ error: 'You do not have permission!' });
    }

    return true;
  }
}
