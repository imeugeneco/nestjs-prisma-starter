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

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMyInfo(
    @Headers() headers: any,
    @Res() res: Response,
  ): Promise<Response> {
    const user = await this.userService.getUserInfoExcludingKeys(
      { id: headers.user.id },
      ['username', 'password'],
    );
    return sendResponse(res, HttpStatus.OK, user);
  }
}
