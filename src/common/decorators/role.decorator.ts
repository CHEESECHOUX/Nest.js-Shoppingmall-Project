import { SetMetadata } from '@nestjs/common';

export type AllowedRole = 'ADMIN' | 'MANAGER' | 'CUSTOMER';

export const Roles = (...roles: AllowedRole[]) => SetMetadata('roles', roles);
