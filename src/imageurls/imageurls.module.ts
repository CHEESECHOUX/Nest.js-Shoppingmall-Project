import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Imageurl } from '@src/imageurls/entity/imageurl.entity';
import { ImageurlsRepository } from '@src/imageurls/imageurls.repository';
import { Product } from '@src/products/entity/product.entity';
import { UploadsService } from '@src/uploads/uploads.service';

@Module({
    imports: [TypeOrmModule.forFeature([Imageurl, Product])],
    providers: [ImageurlsRepository, UploadsService],
})
export class ImageurlsModule {}
