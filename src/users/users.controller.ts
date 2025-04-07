import {
  Body,
  Get,
  Post,
  Delete,
  Query,
  UseGuards,
  Res,
  Param,
  Patch,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionGuard } from '../common/guard/permission.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { successResponse } from 'src/utils/success.response';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(AuthGuard, PermissionGuard)
  @Permissions('create_users')
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await this.usersService.create(createUserDto);
    return successResponse(res, 201, 'User created successfully', user, {});
  }
  @UseGuards(AuthGuard, PermissionGuard)
  @Permissions('read_users')
  @Get()
  async findAll(@Res() res: Response, @Query('keyword') keyword: string) {
    const users = await this.usersService.findAll(keyword);
    return successResponse(res, 200, 'Users fetched successfully', users, {});
  }
  @UseGuards(AuthGuard, PermissionGuard)
  @Permissions('read_users')
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const user = await this.usersService.findById(+id);
    return successResponse(res, 200, 'User fetched successfully', user, {});
  }
  @UseGuards(AuthGuard, PermissionGuard)
  @Permissions('update_users')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.usersService.update(+id, updateUserDto);
    return successResponse(res, 200, 'User updated successfully', user, {});
  }
  @UseGuards(AuthGuard, PermissionGuard)
  @Permissions('delete_users')
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const user = await this.usersService.remove(+id);
    return successResponse(res, 200, 'User deleted successfully', user, {});
  }
  @UseGuards(AuthGuard, PermissionGuard)
  @Permissions('update_users')
  @Patch('status/:id')
  async updateStatus(@Param('id') id: string, @Res() res: Response) {
    const user = await this.usersService.updateStatus(+id);
    return successResponse(
      res,
      200,
      'User status updated successfully',
      user,
      {},
    );
  }
}
