import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionGuard } from '../common/guard/permission.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { successResponse } from 'src/utils/success.response';
import { Response } from 'express';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UseGuards(AuthGuard, PermissionGuard)
  @Permissions('create_roles')
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto, @Res() res: Response) {
    const role = await this.roleService.create(createRoleDto);
    return successResponse(res, 201, 'Role created successfully', role, {});
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Permissions('read_roles')
  @Get()
  async findAll(@Res() res: Response, @Query('keyword') keyword: string) {
    const roles = await this.roleService.findAll(keyword);
    return successResponse(res, 200, 'Roles fetched successfully', roles, {});
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Permissions('read_roles')
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const role = await this.roleService.findOne(+id);
    return successResponse(res, 200, 'Role fetched successfully', role, {});
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Permissions('update_roles')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Res() res: Response,
  ) {
    const role = await this.roleService.update(+id, updateRoleDto);
    return successResponse(res, 200, 'Role updated successfully', role, {});
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Permissions('delete_roles')
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const role = await this.roleService.remove(+id);
    return successResponse(res, 200, 'Role deleted successfully', role, {});
  }
}
