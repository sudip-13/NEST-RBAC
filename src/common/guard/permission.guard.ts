import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { User } from '../../entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user) {
      throw new ForbiddenException('No user in request');
    }

    const userRepo = this.dataSource.getRepository(User);
    const loadedUser = await userRepo.findOne({
      where: { id: user.id },
      relations: ['roles', 'roles.permissions'],
    });

    if (!loadedUser) {
      throw new ForbiddenException('User not found');
    }

    const userPermissions = new Set<string>();
    for (const role of loadedUser.roles) {
      for (const permission of role.permissions) {
        userPermissions.add(permission.slug);
      }
    }

    const hasPermission = requiredPermissions.every((perm) =>
      userPermissions.has(perm),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Missing permissions: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }
}
