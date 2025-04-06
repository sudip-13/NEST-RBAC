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
}
