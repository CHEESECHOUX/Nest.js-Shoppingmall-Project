import { SetMetadata } from '@nestjs/common';

export type AllowedRole = 'ADMIN' | 'MANAGER' | 'CUSTOMER';

export const Role = (roles: AllowedRole[]) => SetMetadata('roles', roles);
