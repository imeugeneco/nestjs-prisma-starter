import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export function sendResponse(res: Response, statusCode: HttpStatus, data: any) {
  return res.status(statusCode).json({ statusCode, data });
}
