import { Injectable, NotFoundException, Res } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionGuard } from '../common/guard/permission.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { successResponse } from 'src/utils/success.response';
import { Response } from 'express';
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
  async findOne(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with mail ${email} not found`);
    }

    return user;
  }

  async getUserAccess(user: User): Promise<string[]> {
    const loadedUser = await this.userRepo.findOne({
      where: { id: user.id },
      relations: ['roles', 'roles.permissions'],
    });

    if (!loadedUser) {
      throw new NotFoundException('User not found');
    }

    const permissions = new Set<string>();

    for (const role of loadedUser.roles) {
      for (const permission of role.permissions) {
        permissions.add(permission.slug); // or use `slug` if preferred
      }
    }

    return Array.from(permissions);
  }
}
