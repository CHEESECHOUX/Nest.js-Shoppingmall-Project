import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from '@src/products/products.service';
import { Product } from '@src/products/entity/product.entity';
import { CreateProductDTO, ProductInfoDTO } from '@src/products/dto/products.dto';
import { JwtAuthGuard } from '@src/users/jwt/jwt.guard';
import { User } from '@src/users/entity/user.entity';
import { GetUserRequest } from '@src/common/decorators/get-user-request.decorator';
import { RolesGuard } from '@src/guards/roles.guard';
import { Roles } from '@src/common/decorators/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get(':id')
    async getProductById(@Param('id', ParseIntPipe) id: number): Promise<ProductInfoDTO | null> {
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(FileInterceptor('file'))
    async createProductWithImage(
        @GetUserRequest() user: User,
        @UploadedFile() imageFile: Express.Multer.File,
        @Body() createProductDTO: CreateProductDTO,
    ): Promise<Product> {
        return this.productsService.createProductWithImage(user, createProductDTO, imageFile);
    }

    @Patch(':id')
    @Roles('ADMIN', 'MANAGER')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(FileInterceptor('file'))
    async updateProductWithImage(
        @Param('id') productId: number,
        @UploadedFile() imageFile: Express.Multer.File,
        @Body() createProductDTO: CreateProductDTO,
    ): Promise<Product> {
        return this.productsService.updateProductWithImage(productId, createProductDTO, imageFile);
    }

    @Delete(':id')
    @Roles('ADMIN', 'MANAGER')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async softDeleteProduct(@Param('id') productId: number): Promise<void> {
        return this.productsService.softDeleteById(productId);
    }

    @Delete('/images/:id')
    @Roles('ADMIN', 'MANAGER')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async hardDeleteImagesByProductId(@Param('id') productId: number): Promise<void> {
        return this.productsService.hardDeleteImagesByProductId(productId);
    }
}
