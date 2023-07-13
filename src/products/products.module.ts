import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { ProductsRepository } from './products.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Product])],
    providers: [ProductsService, ProductsRepository],
    controllers: [ProductsController],
})
export class ProductsModule {}
