import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@src/products/entity/product.entity';
import { ILike, Repository } from 'typeorm';
import { CreateProductDTO, ProductInfoDTO } from '@src/products/dto/products.dto';
import { User } from '@src/users/entity/user.entity';
import { UploadsService } from '@src/uploads/uploads.service';
import { ImageUrl } from '@src/imageurls/entity/imageurl.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(ImageUrl)
        private imageUrlsRepository: Repository<ImageUrl>,
        private uploadsService: UploadsService,
    ) {}

    async searchById(id: number): Promise<ProductInfoDTO | null> {
        const productInfo = await this.productsRepository.findOne({ where: { id } });
        if (!productInfo) {
            throw new UnauthorizedException('상품을 찾을 수 없습니다');
        }

        return productInfo;
    }

    async searchByName(productName: string): Promise<Product[]> {
        const products = await this.productsRepository.find({
            where: { productName: ILike(`%${productName}%`) },
        });

        return products;
    }

    async createProductWithImage(user: User, createProductDTO: CreateProductDTO, file): Promise<Product> {
        const { productName, brandName, description, price } = createProductDTO;
        console.log(createProductDTO);

        const existingProduct = await this.productsRepository.findOne({
            where: [{ productName, brandName }],
        });
        if (existingProduct && existingProduct.productName === productName && existingProduct.brandName === brandName) {
            throw new ConflictException('이미 동일한 상품이 존재합니다');
        }

        const newProduct = new Product();
        newProduct.user = user;
        newProduct.productName = productName;
        newProduct.brandName = brandName;
        newProduct.description = description;
        newProduct.price = price;

        const savedProduct = await this.productsRepository.save(newProduct);

        const fileUrl = await this.uploadsService.uploadFile(file, newProduct.id);

        const imageUrl = new ImageUrl();
        imageUrl.imageUrl = fileUrl;
        imageUrl.product = newProduct;
        await this.imageUrlsRepository.save(imageUrl);

        newProduct.imageUrls = [imageUrl];

        savedProduct.imageUrls = [imageUrl];

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

    async softDeleteById(id: number): Promise<void> {
        await this.productsRepository.update(id, { isDeleted: true });
    }
}
