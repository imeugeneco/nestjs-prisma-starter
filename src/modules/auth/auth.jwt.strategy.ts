import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('token'),
      ]),
      ignoreExpiration: process.env.NODE_ENV === 'dev',
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: User) {
    const username = payload.username;
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
