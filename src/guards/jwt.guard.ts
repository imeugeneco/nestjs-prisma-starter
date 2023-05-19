import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const user = await this.authService.getUserFromToken(
        request.headers.authorization.split('Bearer ')[1],
      );
      if (!user || user.deletedAt) {
        return false;
      }
      request.headers.user = { id: user.id };
      return true;
    } catch (e) {
      if (e instanceof TypeError) {
        throw new NotFoundException('Authorization Header Not Found');
      }
      throw e;
    }
  }
}
