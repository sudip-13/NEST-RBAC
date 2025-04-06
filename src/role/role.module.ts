import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
    TypeOrmModule.forFeature([Role]),
    AuthModule,
    UsersModule,
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
