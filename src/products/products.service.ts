import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDTO } from './dto/products.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) {}

    async createProduct(createProductDTO: CreateProductDTO): Promise<Product> {
        const { productName, brandName, description, price } = createProductDTO;

        const existingProduct = await this.productsRepository.findOne({
            where: [{ productName, brandName }],
        });
        if (existingProduct && existingProduct.productName === productName && existingProduct.brandName === brandName) {
            throw new ConflictException('이미 동일한 상품이 존재합니다');
        }

        const newProduct = new Product();
        newProduct.productName = productName;
        newProduct.brandName = brandName;
        newProduct.description = description;
        newProduct.price = price;

        await this.productsRepository.save(newProduct);

        return newProduct;
    }

    async updateProduct(id: number, createProductDTO: CreateProductDTO): Promise<Product> {
        const { productName, brandName, description, price } = createProductDTO;

        const updateProduct = await this.productsRepository.findOne({ where: { id } });
        if (!updateProduct) {
            throw new NotFoundException('상품 정보를 찾을 수 없습니다');
        }

        updateProduct.productName = productName;
        updateProduct.brandName = brandName;
        updateProduct.description = description;
        updateProduct.price = price;

        await this.productsRepository.save(updateProduct);

        return updateProduct;
    }
}
