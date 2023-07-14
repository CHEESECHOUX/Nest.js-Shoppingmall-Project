import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entity/product.entity';
import { CreateProductDTO, ProductInfoDTO } from './dto/products.dto';
import { JwtAuthGuard } from '@src/users/jwt/jwt.guard';
import { User } from '@src/users/entity/user.entity';
import { GetUserSession } from '@src/common/decorators/get-user-session.decorator';

@Controller('/products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get(':id')
    async getProduct(@Param('id') id: number): Promise<ProductInfoDTO | null> {
        const productInfo = await this.productsService.getProductById(id);
        return productInfo;
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createProduct(@GetUserSession() user: User, @Body() createProductDTO: CreateProductDTO): Promise<Product> {
        return this.productsService.createProduct(user, createProductDTO);
    }

    @Patch(':id')
    async updateProduct(@Param('id') id: number, @Body() createProductDTO: CreateProductDTO): Promise<Product> {
        return this.productsService.updateProduct(id, createProductDTO);
    }

    @Delete(':id')
    async softDeleteProduct(@Param('id') id: number): Promise<void> {
        return this.productsService.softDeleteById(id);
    }
}
