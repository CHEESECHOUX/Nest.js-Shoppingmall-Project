import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RolesService } from '@src/roles/roles.service';
import { Role } from '@src/roles/entity/role.entity';
import { CreateRoleDTO } from '@src/roles/dto/roles.dto';
import { GetUserSession } from '@src/common/decorators/get-user-session.decorator';
import { User } from '@src/users/entity/user.entity';
import { JwtAuthGuard } from '@src/users/jwt/jwt.guard';
import { RolesGuard } from '@src/guards/roles.guard';
import { Roles } from '@src/common/decorators/role.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Post()
    @Roles('ADMIN')
    async createRole(@GetUserSession() user: User, @Body() createRoleDTO: CreateRoleDTO): Promise<Role> {
        return this.rolesService.createRole(user, createRoleDTO);
    }
}
