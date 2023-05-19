import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';

import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';

import { PasswordService } from './password.service';
import { AuthResponseDTO, LoginUserDTO } from './auth.dto';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from 'src/configs/config.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
  ) {}

  async create(userData: Prisma.UserCreateInput): Promise<AuthResponseDTO> {
    userData.password = await this.passwordService.hashPassword(
      userData.password,
    );

    try {
      const payload = await this.prisma.user.create({
        data: {
          ...userData,
          nickname: userData.username ? userData.username : undefined,
        },
      });

      return this.generateTokens({ id: payload.id });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(
          `Username ${userData.username} already taken.`,
        );
      }
      throw new Error(e);
    }
  }

  async login(loginUserDTO: LoginUserDTO): Promise<AuthResponseDTO> {
    const user = await this.userService.getUserByUniqueKey({
      username: loginUserDTO.username,
    });

    if (!user) {
      throw new UnauthorizedException('User Not Found');
    }

    const passwordValid = await this.passwordService.validatePassword(
      loginUserDTO.password,
      user.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid Password');
    }

    return this.generateTokens({ id: user.id });
  }

  validateUser(userId: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  getUserFromToken(token: string): Promise<User> {
    const userId = this.jwtService.decode(token)['userId'];
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  generateTokens(payload: { id: string }): any {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { id: string }): string {
    return this.jwtService.sign({ userId: payload.id });
  }

  private generateRefreshToken(payload: { id: string }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(
      { userId: payload.id },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: securityConfig.expiresIn,
      },
    );
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({
        id: userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
