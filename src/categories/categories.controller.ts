import { Body, Controller, Post } from '@nestjs/common';
import { CategoriesService } from '@src/categories/categories.service';
import { CreateCategoryDTO } from '@src/categories/dto/categories.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    async createCategory(@Body() createCategoryDTO: CreateCategoryDTO) {
        return this.categoriesService.createCategory(createCategoryDTO);
    }
}
