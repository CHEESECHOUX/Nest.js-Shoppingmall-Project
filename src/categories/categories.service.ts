import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/categories.entity';
import { ILike, Repository } from 'typeorm';
import { CategoryInfoDTO, CreateCategoryDTO } from '@src/categories/dto/categories.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) {}

    async searchById(id: number): Promise<CategoryInfoDTO | null> {
        const categoryInfo = await this.categoriesRepository.findOne({ where: { id } });
        if (!categoryInfo) {
            throw new UnauthorizedException('카테고리를 찾을 수 없습니다');
        }

        return categoryInfo;
    }

    async searchByName(name: string): Promise<Category[]> {
        const categories = await this.categoriesRepository.find({
            where: { name: ILike(`%${name}%`) },
        });

        return categories;
    }

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

    async updateCategory(id: number, createCategoryDTO: CreateCategoryDTO): Promise<Category> {
        const { name } = createCategoryDTO;

        const category = await this.categoriesRepository.findOne({ where: { id } });
        if (!category) {
            throw new NotFoundException('카테고리 정보를 찾을 수 없습니다');
        }

        category.name = name;

        await this.categoriesRepository.save(category);

        return category;
    }
}
