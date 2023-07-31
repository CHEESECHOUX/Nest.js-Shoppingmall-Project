import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UseGuards } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '@src/users/entity/user-role.entity';
import { Repository } from 'typeorm';

const matchRoles = (requiredRoles: string[], userRoles: string[]): boolean => {
    return requiredRoles.some(role => userRoles.includes(role));
};

@Injectable()
@UseGuards(RolesGuard)
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @InjectRepository(UserRole)
        private userRolesRepository: Repository<UserRole>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [context.getHandler(), context.getClass()]);
        if (!requiredRoles) {
            return true;
        }

        const req = context.switchToHttp().getRequest() as any;
        const user = req.user;

        if (!user) {
            throw new ForbiddenException('사용자가 존재하지 않습니다');
        }
        const userRoles = await this.userRolesRepository.find({
            where: { user: { id: user.id } },
            relations: ['role'],
        });

        const roles = userRoles.map(userRole => userRole.role.role); // 사용자 역할의 실제 역할 이름만 추출하여 배열로 변환

        console.log(userRoles, roles);
        return matchRoles(requiredRoles, roles);
    }
}
