import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageUrl } from '@src/imageurls/entity/imageUrl.entity';
import { ImageUrlRepository } from '@src/imageurls/imageurls.repository';
import { UploadsService } from '@src/uploads/uploads.service';

@Module({
    imports: [TypeOrmModule.forFeature([ImageUrl])],
    providers: [ImageUrlRepository, UploadsService],
})
export class ImageurlsModule {}
