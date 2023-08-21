import { Module } from '@nestjs/common';
import { RolesService } from '@src/roles/roles.service';
import { RolesController } from '@src/roles/roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '@src/roles/entity/role.entity';
import { UserRole } from '@src/users/entity/user-role.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Role, UserRole])],
    providers: [RolesService],
    controllers: [RolesController],
})
export class RolesModule {}
