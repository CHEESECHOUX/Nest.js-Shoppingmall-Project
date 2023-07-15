import { Module } from '@nestjs/common';
import { UploadsController } from '@src/uploads/uploads.controller';
import { UploadsService } from '@src/uploads/uploads.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageUrl } from '@src/imageurls/entity/imageurl.entity';
import { ProductsRepository } from '@src/products/products.repository';
import { Product } from '@src/products/entity/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ImageUrl, Product])],
    controllers: [UploadsController],
    providers: [UploadsService, ProductsRepository],
})
export class UploadsModule {}
