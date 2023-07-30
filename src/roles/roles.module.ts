import { Module } from '@nestjs/common';
import { RolesService } from '@src/roles/roles.service';
import { RolesController } from '@src/roles/roles.controller';

@Module({
    providers: [RolesService],
    controllers: [RolesController],
})
export class RolesModule {}
