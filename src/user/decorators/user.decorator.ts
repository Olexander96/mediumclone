import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  //кастомний декоратор
  const request = ctx.switchToHttp().getRequest(); //доступ до запиту

  if (!request) {
    return null;
  }

  if (data) {
    return request.user[data];
  }

  return request.user;
});
