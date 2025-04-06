import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from '../entities/role.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    const { name, description } = createRoleDto;
    const permissions = await this.permissionRepo.findBy({
      id: In(createRoleDto.permissions),
    });
    const role = this.roleRepo.create({
      name: name,
      description: description,
      permissions,
    });
    const savedRole = await this.roleRepo.save(role);
    if (savedRole) {
      return savedRole;
    } else {
      throw new BadRequestException('Something went wrong');
    }
  }

  async findAll(keyword?: string) {
    const queryBuilder = this.roleRepo.createQueryBuilder('role');
    if (keyword) {
      queryBuilder.where(
        '(role.name LIKE :keyword OR role.slug LIKE :keyword OR role.description LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }
    queryBuilder.orderBy('role.updatedAt', 'DESC');
    const roles = await queryBuilder.getMany();
    return roles;
  }

  async findOne(id: number) {
    const role = await this.roleRepo.findOne({
      where: { id },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const { name, description } = updateRoleDto;
    const permissions = await this.permissionRepo.findBy({
      id: In(updateRoleDto.permissions || []),
    });
    const role = await this.roleRepo.findOne({
      where: { id },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    role.name = name ?? role.name;
    role.description = description ?? role.description;
    role.permissions = permissions;
    const updatedRole = await this.roleRepo.save(role);
    if (updatedRole) {
      return updatedRole;
    }
    throw new BadRequestException('Something went wrong');
  }

  async remove(id: number) {
    const role = await this.roleRepo.findOne({
      where: { id },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    const deletedRole = await this.roleRepo.delete(id);
    if (deletedRole) {
      return deletedRole;
    }
    throw new BadRequestException('Something went wrong');
  }
}
