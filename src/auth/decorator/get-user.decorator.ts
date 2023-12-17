import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user;

  if (data === 'id') {
    if (!user) return -1;
  }

  if (!user) {
    throw new UnauthorizedException('Token not valid');
  }

  if (!data) {
    return user;
  }

  if (data) {
    return user[data];
  }
});
