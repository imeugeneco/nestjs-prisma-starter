import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { CreateUserDTO, LoginUserDTO } from './auth.dto';
import { sendResponse } from 'src/shared/helpers/api.response.helper';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async create(
    @Body() userData: CreateUserDTO,
    @Res() res: Response,
  ): Promise<Response> {
    const user = await this.authService.create(userData);
    return sendResponse(res, HttpStatus.CREATED, user);
  }

  @Post('login')
  async login(
    @Body() userData: LoginUserDTO,
    @Res() res: Response,
  ): Promise<Response> {
    const user = await this.authService.login(userData);
    return sendResponse(res, HttpStatus.OK, user);
  }

  // TODO: logout
}
