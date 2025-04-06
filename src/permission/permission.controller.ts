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
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionGuard } from '../common/guard/permission.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { successResponse } from '../utils/success.response';
import { Response } from 'express';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @UseGuards(AuthGuard, PermissionGuard)
  @Permissions('create_permissions')
  @Post()
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
    @Res() res: Response,
  ) {
    const permissions =
      await this.permissionService.create(createPermissionDto);
    return successResponse(
      res,
      201,
      'Permissions created successfully',
      permissions,
      {},
    );
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Permissions('read_permissions')
  @Get()
  async findAll(@Res() res: Response, @Query('keyword') keyword: string) {
    const permission = await this.permissionService.findAll(keyword);
    return successResponse(
      res,
      200,
      'Permissions retrieved successfully',
      permission,
      {},
    );
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Permissions('read_permissions')
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const permission = await this.permissionService.findOne(+id);
    return successResponse(
      res,
      200,
      'Permission retrieved successfully',
      permission,
      {},
    );
  }

  @UseGuards(AuthGuard, PermissionGuard)
  @Permissions('update_permissions')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @Res() res: Response,
  ) {
    const permission = await this.permissionService.update(
      +id,
      updatePermissionDto,
    );
    return successResponse(
      res,
      200,
      'Permission updated successfully',
      permission,
      {},
    );
  }
  @UseGuards(AuthGuard, PermissionGuard)
  @Permissions('delete_permissions')
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const permission = await this.permissionService.remove(+id);
    return successResponse(
      res,
      200,
      'Permission deleted successfully',
      permission,
      {},
    );
  }
}
