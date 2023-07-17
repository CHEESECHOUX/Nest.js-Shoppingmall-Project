import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from '@src/products/products.service';
import { Product } from '@src/products/entity/product.entity';
import { CreateProductDTO, ProductInfoDTO } from '@src/products/dto/products.dto';
import { JwtAuthGuard } from '@src/users/jwt/jwt.guard';
import { User } from '@src/users/entity/user.entity';
import { GetUserSession } from '@src/common/decorators/get-user-session.decorator';
import { RolesGuard } from '@src/guards/roles.guard';
import { Roles } from '@src/common/decorators/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get(':id')
    async getProductById(@Param('id') id: number): Promise<ProductInfoDTO | null> {
        const productInfo = await this.productsService.getProductById(id);
        return productInfo;
    }

    @Get('')
    async getProductsByName(@Query('productName') productName: string): Promise<Product[]> {
        const products = await this.productsService.getProductsByName(productName);
        return products;
    }

    @Get('category/:categoryId')
    async getProductsByCategory(@Param('categoryId') categoryId: number): Promise<Product[]> {
        return this.productsService.getProductsByCategory(categoryId);
    }

    @Post()
    @Roles('ADMIN', 'MANAGER')
    @UseInterceptors(FileInterceptor('file'))
    async createProductWithImage(
        @GetUserSession() user: User,
        @UploadedFile() imageFile: Express.Multer.File,
        @Body() createProductDTO: CreateProductDTO,
    ): Promise<Product> {
        return this.productsService.createProductWithImage(user, createProductDTO, imageFile);
    }

    @Roles('ADMIN', 'MANAGER')
    @UseInterceptors(FileInterceptor('file'))
    @Patch(':id')
    async updateProductWithImage(
        @Param('id') id: number,
        @UploadedFile() imageFile: Express.Multer.File,
        @Body() createProductDTO: CreateProductDTO,
    ): Promise<Product> {
        return this.productsService.updateProductWithImage(id, createProductDTO, imageFile);
    }

    @Roles('ADMIN', 'MANAGER')
    @Delete(':id')
    async softDeleteProduct(@Param('id') productId: number): Promise<void> {
        return this.productsService.softDeleteById(productId);
    }
}
