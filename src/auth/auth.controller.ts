import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { User } from '../entities/user.entity';
import { successResponse } from 'src/utils/success.response';
import * as dotenv from 'dotenv';
dotenv.config();

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: Record<string, string>,
    @Res() res: Response,
  ) {
    const { email, password } = signInDto;
    const user = await this.authService.signIn(email, password);
    const cookieOptions = {
      expires: new Date(
        Date.now() + Number(process.env.JWT_EXPIRY || 1) * 24 * 60 * 60 * 1000,
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
    };
    res.cookie(user.access_token, cookieOptions);
    return successResponse(res, HttpStatus.OK, 'Login successful', user, {});
  }

  @UseGuards(AuthGuard)
  @Get('my-access')
  async getMyAccess(@Request() req: { user: User }, @Res() res: Response) {
    const access = await this.authService.getMyAccess(req.user);
    return successResponse(
      res,
      HttpStatus.OK,
      'Access retrieved successfully',
      access,
      {},
    );
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Request() req: { user: User }, @Res() res: Response) {
    res.cookie('loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    return successResponse(res, HttpStatus.OK, 'Logout successful', {}, {});
  }
}
