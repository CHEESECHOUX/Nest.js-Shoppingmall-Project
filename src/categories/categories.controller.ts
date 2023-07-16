import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoriesService } from '@src/categories/categories.service';
import { CategoryInfoDTO, CreateCategoryDTO } from '@src/categories/dto/categories.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get(':id')
    async searchById(@Param('id') id: number): Promise<CategoryInfoDTO | null> {
        const categoryInfo = await this.categoriesService.searchById(id);
        return categoryInfo;
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
