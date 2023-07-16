import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageUrl } from '@src/imageurls/entity/imageurl.entity';
import { ImageUrlsRepository } from '@src/imageurls/imageurls.repository';
import { Product } from '@src/products/entity/product.entity';
import { UploadsService } from '@src/uploads/uploads.service';

@Module({
    imports: [TypeOrmModule.forFeature([ImageUrl, Product])],
    providers: [ImageUrlsRepository, UploadsService],
})
export class ImageurlsModule {}
