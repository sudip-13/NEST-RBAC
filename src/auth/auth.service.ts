import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string; user: any }> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      sub: user.id,
      email: user.email,
    };
    const { password, ...userWithoutPassword } = user;
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: userWithoutPassword,
    };
  }

  async getMyAccess(user: User): Promise<string[]> {
    return await this.usersService.getUserAccess(user);
  }
}
