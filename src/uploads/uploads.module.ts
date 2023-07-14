import { Module } from '@nestjs/common';
import { UploadsController } from '@src/uploads/uploads.controller';
import { UploadsService } from '@src/uploads/uploads.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageUrl } from '@src/imageurls/entity/imageUrl.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ImageUrl])],
    controllers: [UploadsController],
    providers: [UploadsService],
})
export class UploadsModule {}
