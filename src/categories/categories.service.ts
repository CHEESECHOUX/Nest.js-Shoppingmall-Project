import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '@src/categories/entity/categories.entity';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { CategoryInfoDTO, CreateCategoryDTO, CreateCategoryWithProductDTO } from '@src/categories/dto/categories.dto';
import { Product } from '@src/products/entity/product.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
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

    async createCategoryWithProduct(createCategoryWithProductDTO: CreateCategoryWithProductDTO): Promise<Category> {
        const { name, productId } = createCategoryWithProductDTO;

        const existingCategory = await this.categoriesRepository.findOne({ where: { name } });
        if (existingCategory) {
            throw new ConflictException('이미 동일한 카테고리명이 존재합니다');
        }

        const product = await this.productsRepository.findOne({ where: { id: productId } });
        if (!product) {
            throw new NotFoundException('상품을 찾을 수 없습니다');
        }

        const category = new Category();
        category.name = name;

        category.product = new Product();
        category.product.id = productId;

        await this.categoriesRepository.save(category);

        return category;
    }

    async updateCategory(categoryId: number, createCategoryDTO: CreateCategoryDTO): Promise<Category> {
        const { name } = createCategoryDTO;

        const category = await this.categoriesRepository.findOne({ where: { id: categoryId } });
        if (!category) {
            throw new NotFoundException('카테고리 정보를 찾을 수 없습니다');
        }

        category.name = name;

        await this.categoriesRepository.save(category);

        return category;
    }

    async hardDeleteCategory(categoryId: number): Promise<void> {
        const category = await this.categoriesRepository.findOne({ where: { id: categoryId } });
        if (!category) {
            throw new NotFoundException('카테고리 정보를 찾을 수 없습니다');
        }

        await this.categoriesRepository.delete(categoryId);
    }

    async softDeleteByIdWithProduct(categoryId: number): Promise<void> {
        const category = await this.categoriesRepository.findOneOrFail({ where: { id: categoryId } });

        category.isDeleted = true;
        await this.categoriesRepository.save(category);

        // category와 연결된 product 모두 찾기
        const products = await this.productsRepository.find({
            where: { categories: { id: categoryId } },
        } as FindManyOptions<Product>);

        // 찾은 product들 isDeleted true로 변경
        for (const product of products) {
            product.isDeleted = true;
            await this.productsRepository.save(product);
        }
    }
}
