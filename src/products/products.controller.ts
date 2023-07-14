import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from '@src/products/products.service';
import { Product } from '@src/products/entity/product.entity';
import { CreateProductDTO, ProductInfoDTO } from './dto/products.dto';
import { JwtAuthGuard } from '@src/users/jwt/jwt.guard';
import { User } from '@src/users/entity/user.entity';
import { GetUserSession } from '@src/common/decorators/get-user-session.decorator';
import { RolesGuard } from '@src/guards/roles.guard';
import { Roles } from '@src/common/decorators/role.decorator';

@Controller('/products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get(':id')
    async getProduct(@Param('id') id: number): Promise<ProductInfoDTO | null> {
        const productInfo = await this.productsService.getProductById(id);
        return productInfo;
    }

    @Post()
    @Roles('ADMIN', 'MANAGER')
    async createProduct(@GetUserSession() user: User, @Body() createProductDTO: CreateProductDTO): Promise<Product> {
        return this.productsService.createProduct(user, createProductDTO);
    }

    @Roles('ADMIN', 'MANAGER')
    @Patch(':id')
    async updateProduct(@Param('id') id: number, @Body() createProductDTO: CreateProductDTO): Promise<Product> {
        return this.productsService.updateProduct(id, createProductDTO);
    }

    @Roles('ADMIN', 'MANAGER')
    @Delete(':id')
    async softDeleteProduct(@Param('id') id: number): Promise<void> {
        return this.productsService.softDeleteById(id);
    }
}
