import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '@src/roles/entity/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDTO } from '@src/roles/dto/roles.dto';
import { User } from '@src/users/entity/user.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async createRole(user: User, createRoleDTO: CreateRoleDTO): Promise<Role> {
        const { role } = createRoleDTO;

        const existingRole = await this.rolesRepository.findOne({ where: [{ role }] });
        if (existingRole) {
            throw new ConflictException('이미 동일한 role이 존재합니다');
        }

        if (user.role !== 'ADMIN') {
            throw new UnauthorizedException('ADMIN 권한만 role을 생성할 수 있습니다');
        }

        const createdRole = new Role();
        createdRole.role = role;
        createdRole.user = user;

        await this.rolesRepository.save(createdRole);

        return createdRole;
    }

    async updateRole(roleId: number, user: User, createRoleDTO: CreateRoleDTO): Promise<Role> {
        const { role } = createRoleDTO;

        const updatedRole = await this.rolesRepository.findOne({ where: { id: roleId } });
        if (!updatedRole) {
            throw new NotFoundException('role 정보를 찾을 수 없습니다');
        }

        const existingRole = await this.rolesRepository.findOne({ where: [{ role }] });
        if (existingRole) {
            throw new ConflictException('이미 동일한 role이 존재합니다');
        }

        if (user.role !== 'ADMIN') {
            throw new UnauthorizedException('ADMIN 권한만 role을 수정할 수 있습니다');
        }

        updatedRole.role = role;
        updatedRole.user = user;

        await this.rolesRepository.save(updatedRole);

        return updatedRole;
    }
}
