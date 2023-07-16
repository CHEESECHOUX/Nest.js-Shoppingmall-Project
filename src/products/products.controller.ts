import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from '@src/products/products.service';
import { Product } from '@src/products/entity/product.entity';
import { CreateProductDTO, ProductInfoDTO } from './dto/products.dto';
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
    async searchById(@Param('id') id: number): Promise<ProductInfoDTO | null> {
        const productInfo = await this.productsService.searchById(id);
        return productInfo;
    }

    @Get('')
    async searchByName(@Query('productName') productName: string): Promise<Product[]> {
        const products = await this.productsService.searchByName(productName);
        return products;
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
    async updateProduct(
        @Param('id') id: number,
        @UploadedFile() imageFile: Express.Multer.File,
        @Body() createProductDTO: CreateProductDTO,
    ): Promise<Product> {
        return this.productsService.updateProduct(id, createProductDTO, imageFile);
    }

    @Roles('ADMIN', 'MANAGER')
    @Delete(':id')
    async softDeleteProduct(@Param('id') productId: number): Promise<void> {
        return this.productsService.softDeleteById(productId);
    }
}
