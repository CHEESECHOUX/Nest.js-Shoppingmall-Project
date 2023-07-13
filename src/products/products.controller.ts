import { Body, Controller, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entity/product.entity';
import { CreateProductDTO } from './dto/products.dto';

@Controller('/products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    async createProduct(@Body() createProductDTO: CreateProductDTO): Promise<Product> {
        return this.productsService.createProduct(createProductDTO);
    }
}
