import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type AuthUserType = { id: number };

export const GetUserJWT = createParamDecorator((_, input: ExecutionContext): Promise<AuthUserType> => {
    return input.switchToHttp().getRequest().user;
});
