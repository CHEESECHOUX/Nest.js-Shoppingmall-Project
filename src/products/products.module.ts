import { Module } from '@nestjs/common';
import { ProductsService } from '@src/products/products.service';
import { ProductsController } from '@src/products/products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@src/products/entity/product.entity';
import { ProductsRepository } from '@src/products/products.repository';
import { UploadsService } from '@src/uploads/uploads.service';
import { ImageUrl } from '@src/imageurls/entity/imageurl.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Product, ImageUrl])],
    providers: [ProductsService, ProductsRepository, UploadsService],
    controllers: [ProductsController],
})
export class ProductsModule {}
