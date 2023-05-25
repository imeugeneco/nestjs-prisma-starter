import {
  Controller,
  Get,
  Headers,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { Response } from 'express';
import { sendResponse } from 'src/shared/helpers/api.response.helper';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMyInfo(
    @CurrentUser() user: User,
    @Res() res: Response,
  ): Promise<Response> {
    const userInfo = await this.userService.getUserInfoExcludingKeys(
      { id: user.id },
      ['username', 'password'],
    );
    return sendResponse(res, HttpStatus.OK, userInfo);
  }
}
