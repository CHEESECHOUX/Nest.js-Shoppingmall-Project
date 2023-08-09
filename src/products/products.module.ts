import { Module } from '@nestjs/common';
import { ProductsService } from '@src/products/products.service';
import { ProductsController } from '@src/products/products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@src/products/entity/product.entity';
import { ProductsRepository } from '@src/products/products.repository';
import { UploadsService } from '@src/uploads/uploads.service';
import { Imageurl } from '@src/imageurls/entity/imageurl.entity';
import { Cart } from '@src/carts/entity/carts.entity';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@src/users/entity/user-role.entity';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisConfigService } from '@src/config/redis-config.service';
import { CacheService } from '@src/cache/cache.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, Imageurl, Cart, UserRole]),
        RedisModule.forRootAsync({
            useClass: RedisConfigService,
        }),
    ],
    providers: [ProductsService, ProductsRepository, UploadsService, JwtService, CacheService],
    controllers: [ProductsController],
})
export class ProductsModule {}
