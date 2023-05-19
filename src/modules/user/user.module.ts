import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaModule } from '../prisma/prisma.module';
import { PasswordService } from '../auth/password.service';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    UserService,
    PasswordService,
    JwtService,
    JwtAuthGuard,
    AuthService,
  ],
  exports: [UserService],
})
export class UserModule {}
