import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RolesService } from '@src/roles/roles.service';
import { Role } from '@src/roles/entity/role.entity';
import { CreateRoleDTO } from '@src/roles/dto/roles.dto';
import { GetUserRequest } from '@src/common/decorators/get-user-request.decorator';
import { User } from '@src/users/entity/user.entity';
import { JwtAuthGuard } from '@src/users/jwt/jwt.guard';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Get()
    async getAllRoles(): Promise<Role[]> {
        return await this.rolesService.getAllRoles();
    }

    @Post()
    async createRole(@GetUserRequest() user: User, @Body() createRoleDTO: CreateRoleDTO): Promise<Role> {
        return this.rolesService.createRole(user, createRoleDTO);
    }

    @Patch(':id')
    async updateRole(@Param('id') roleId: number, @GetUserRequest() user: User, @Body() createRoleDTO: CreateRoleDTO): Promise<Role> {
        return this.rolesService.updateRole(roleId, user, createRoleDTO);
    }

    @Delete(':id')
    async hardDeleteRole(@Param('id') roleId: number, @GetUserRequest() user: User): Promise<void> {
        return this.rolesService.hardDeleteRole(roleId, user);
    }
}
