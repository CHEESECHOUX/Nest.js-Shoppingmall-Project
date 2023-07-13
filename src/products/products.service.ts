import { ConflictException, Injectable } from '@nestjs/common';
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
}
