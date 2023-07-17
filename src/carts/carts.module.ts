import { Module } from '@nestjs/common';
import { CartsService } from '@src/carts/carts.service';
import { CartsController } from '@src/carts/carts.controller';
import { Cart } from '@src/carts/entity/carts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@src/products/entity/product.entity';
import { User } from '@src/users/entity/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Cart, User, Product])],
    providers: [CartsService],
    controllers: [CartsController],
})
export class CartsModule {}
