import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/categories.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDTO } from './dto/categories.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) {}

    async createCategory(createCategoryDTO: CreateCategoryDTO): Promise<Category> {
        const { name } = createCategoryDTO;

        const existingCategory = await this.categoriesRepository.findOne({ where: { name } });
        if (existingCategory) {
            throw new ConflictException('이미 동일한 카테고리명이 존재합니다');
        }

        const category = new Category();
        category.name = name;

        await this.categoriesRepository.save(category);

        return category;
    }
}
