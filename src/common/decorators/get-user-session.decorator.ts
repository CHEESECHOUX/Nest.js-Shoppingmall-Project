import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { User } from '@src/users/entity/user.entity';

export const GetUserSession = createParamDecorator((data, ctx: ExecutionContextHost): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
});
