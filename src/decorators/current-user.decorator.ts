import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { Dictionary } from 'code-config';

interface Client {
  headers: Dictionary<string>;
  user: User;
}

const getClient = <T = Client>(ctx: ExecutionContext): T => {
  return ctx.switchToHttp().getRequest().headers;
};

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => getClient(ctx).user,
);
