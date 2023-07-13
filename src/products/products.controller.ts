import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entity/product.entity';
import { CreateProductDTO, ProductInfoDTO } from './dto/products.dto';

@Controller('/products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get(':id')
    async getProduct(@Param('id') id: number): Promise<ProductInfoDTO | null> {
        const productInfo = await this.productsService.getProductInfo(id);
        return productInfo;
    }

    @Post()
    async createProduct(@Body() createProductDTO: CreateProductDTO): Promise<Product> {
        return this.productsService.createProduct(createProductDTO);
    }

    @Patch(':id')
    async updateProduct(@Param('id') id: number, @Body() createProductDTO: CreateProductDTO): Promise<Product> {
        return this.productsService.updateProduct(id, createProductDTO);
    }
}
