import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import moment from 'moment-timezone';
import { sendResponse } from 'src/shared/helpers/api.response.helper';

@Controller()
export class AppController {
  @Get()
  async getHello(@Res() res: Response): Promise<Response> {
    const prisma = new PrismaClient();
    const userCount = await prisma.user.count({});
    const env = process.env.NODE_ENV;
    const time = moment();
    return sendResponse(res, HttpStatus.OK, { env, userCount, time });
  }
}
