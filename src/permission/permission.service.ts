import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
  ) {}

  async create(
    createPermissionDto: CreatePermissionDto,
  ): Promise<Permission[]> {
    const { permission_type, display_name, description, resource, action } =
      createPermissionDto;
    const permissions: Permission[] = [];

    try {
      if (permission_type === 'basic') {
        if (!display_name || !description) {
          throw new Error('Display name and description are required.');
        }

        const permission = new Permission();
        permission.name = display_name;
        permission.description = description;

        permissions.push(await this.permissionRepo.save(permission));
      } else {
        if (!resource || !action || action.length === 0) {
          throw new Error('Resource and at least one action are required.');
        }

        for (const act of action) {
          if (!['create', 'read', 'update', 'delete'].includes(act)) {
            throw new Error(`Invalid action: ${act}.`);
          }

          const permission = new Permission();
          permission.name = `${this.capitalize(resource)} ${this.capitalize(act)}`;
          permission.description = `Allows a user to ${act} a ${this.capitalize(resource)}`;

          permissions.push(await this.permissionRepo.save(permission));
        }
      }
    } catch (error: any) {
      throw new Error(
        `Permission could not be created. ${error instanceof Error ? error.message : ''}`,
      );
    }

    return permissions;
  }

  async findAll(keyword?: string) {
    const queryBuilder = this.permissionRepo.createQueryBuilder('permission');

    if (keyword) {
      queryBuilder.where(
        '(permission.name LIKE :keyword OR permission.slug LIKE :keyword OR permission.description LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }
    queryBuilder.orderBy('permission.updatedAt', 'DESC');
    const permissions = await queryBuilder.getMany();

    return permissions;
  }

  async findOne(id: number) {
    const permission = await this.permissionRepo.findOneBy({ id });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    console.log(permission);
    return permission;
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.permissionRepo.findOneBy({ id });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    const { display_name, description } = updatePermissionDto;
    permission.name = display_name;
    permission.description = description;
    const updatedPermission = await this.permissionRepo.save(permission);
    return updatedPermission;
  }

  async remove(id: number) {
    const permission = await this.permissionRepo.findOneBy({ id });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return this.permissionRepo.delete(id);
  }
  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
