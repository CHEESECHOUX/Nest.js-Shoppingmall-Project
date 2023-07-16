import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CategoriesService } from '@src/categories/categories.service';
import { CategoryInfoDTO, CreateCategoryDTO } from '@src/categories/dto/categories.dto';
import { Category } from './entity/categories.entity';

@Controller('categories')
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
    async createCategory(@Body() createCategoryDTO: CreateCategoryDTO) {
        return this.categoriesService.createCategory(createCategoryDTO);
    }

    @Patch(':id')
    async updateCategory(@Param('id') id: number, @Body() createCategoryDTO: CreateCategoryDTO) {
        return this.categoriesService.updateCategory(id, createCategoryDTO);
    }
}
