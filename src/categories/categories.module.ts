import { Module } from '@nestjs/common';
import { CategoriesService } from '@src/categories/categories.service';
import { CategoriesController } from '@src/categories/categories.controller';
import { Category } from '@src/categories/entity/categories.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@src/products/entity/product.entity';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@src/users/entity/user-role.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Category, Product, UserRole])],
    providers: [CategoriesService, JwtService],
    controllers: [CategoriesController],
})
export class CategoriesModule {}
