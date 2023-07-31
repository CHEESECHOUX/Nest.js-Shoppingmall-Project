import { Module } from '@nestjs/common';
import { ProductsService } from '@src/products/products.service';
import { ProductsController } from '@src/products/products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@src/products/entity/product.entity';
import { ProductsRepository } from '@src/products/products.repository';
import { UploadsService } from '@src/uploads/uploads.service';
import { ImageUrl } from '@src/imageurls/entity/imageurl.entity';
import { Cart } from '@src/carts/entity/carts.entity';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@src/users/entity/user-role.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Product, ImageUrl, Cart, UserRole])],
    providers: [ProductsService, ProductsRepository, UploadsService, JwtService],
    controllers: [ProductsController],
})
export class ProductsModule {}
