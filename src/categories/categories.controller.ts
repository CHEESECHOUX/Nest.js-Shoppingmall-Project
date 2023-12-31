import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CategoriesService } from '@src/categories/categories.service';
import { CategoryInfoDTO, CreateCategoryDTO, CreateCategoryWithProductDTO } from '@src/categories/dto/categories.dto';
import { Category } from '@src/categories/entity/categories.entity';
import { JwtAuthGuard } from '@src/users/jwt/jwt.guard';
import { RolesGuard } from '@src/guards/roles.guard';
import { Roles } from '@src/common/decorators/role.decorator';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get(':id')
    async searchById(@Param('id') id: number): Promise<CategoryInfoDTO | null> {
        const categoryInfo = await this.categoriesService.searchById(id);
        return categoryInfo;
    }

    @Get('')
    async searchByName(@Query('name') name: string): Promise<Category[]> {
        const categoriesInfo = await this.categoriesService.searchByName(name);
        return categoriesInfo;
    }

    @Post()
    @Roles('ADMIN')
    async createCategory(@Body() createCategoryDTO: CreateCategoryDTO) {
        return this.categoriesService.createCategory(createCategoryDTO);
    }

    @Post('/product')
    @Roles('ADMIN')
    async createCategoryWithProduct(@Body() createCategoryWithProductDTO: CreateCategoryWithProductDTO) {
        return this.categoriesService.createCategoryWithProduct(createCategoryWithProductDTO);
    }

    @Patch(':id')
    @Roles('ADMIN')
    async updateCategory(@Param('id') categoryId: number, @Body() createCategoryDTO: CreateCategoryDTO) {
        return this.categoriesService.updateCategory(categoryId, createCategoryDTO);
    }

    @Delete(':id')
    @Roles('ADMIN')
    async hardDeleteCategory(@Param('id') categoryId: number): Promise<void> {
        return this.categoriesService.hardDeleteCategory(categoryId);
    }

    @Delete('/with-product/:id')
    @Roles('ADMIN')
    async softDeleteCategoryWithProduct(@Param('id') categoryId: number): Promise<void> {
        return this.categoriesService.softDeleteByIdWithProduct(categoryId);
    }
}
