import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/entities/role.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const roles = await this.roleRepo.findBy({
      id: In(createUserDto.roles),
    });
    const { name, email, password } = createUserDto;
    const user = this.userRepo.create({
      name: name,
      email: email,
      password: password,
      roles: roles,
    });
    const savedUser = await this.userRepo.save(user);
    if (savedUser) {
      const { password, ...userWithoutPassword } = savedUser;
      return userWithoutPassword;
    }
    throw new BadRequestException('Something went wrong');
  }
  async findAll(keyword?: string) {
    const queryBuilder = this.userRepo.createQueryBuilder('user');
    if (keyword) {
      queryBuilder.where(
        '(user.name LIKE :keyword OR user.email LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }
    queryBuilder.orderBy('user.updatedAt', 'DESC');
    const users = await queryBuilder.getMany();
    const usersWithoutPassword = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    if (users.length === 0) {
      throw new NotFoundException('No users found');
    }

    return usersWithoutPassword;
  }
  async findOne(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with mail ${email} not found`);
    }

    return user;
  }
  async findById(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    const roles = await this.roleRepo.findBy({
      id: In(updateUserDto.roles || []),
    });
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    user.name = updateUserDto.name || user.name;
    user.email = updateUserDto.email || user.email;
    user.password = updateUserDto.password || user.password;
    user.roles = roles || user.roles;
    const updatedUser = await this.userRepo.save(user);
    if (updatedUser) {
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    }
    throw new BadRequestException('Something went wrong');
  }
  async remove(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const deleteduser = await this.userRepo.delete(id);
    if (deleteduser) {
      return deleteduser;
    }
    throw new BadRequestException('Something went wrong');
  }

  async updateStatus(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    user.status = !user.status;
    const updatedUser = await this.userRepo.save(user);
    if (updatedUser) {
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    }
    throw new BadRequestException('Something went wrong');
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
