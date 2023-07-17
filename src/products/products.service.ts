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

    async createProductWithImage(user: User, createProductDTO: CreateProductDTO, imageFile: Express.Multer.File): Promise<Product> {
        const { productName, brandName, description, price } = createProductDTO;

        const existingProduct = await this.productsRepository.findOne({
            where: [{ productName, brandName }],
        });
        if (existingProduct && existingProduct.productName === productName && existingProduct.brandName === brandName) {
            throw new ConflictException('이미 동일한 상품이 존재합니다');
        }

        const product = new Product();
        product.user = user;
        product.productName = productName;
        product.brandName = brandName;
        product.description = description;
        product.price = price;
        const createdProduct = await this.productsRepository.save(product);

        const uploadedImageUrl = await this.uploadsService.uploadFile(imageFile, createdProduct.id);

        const imageUrl = new ImageUrl();
        imageUrl.imageUrl = uploadedImageUrl;
        imageUrl.product = createdProduct;

        await this.imageUrlsRepository.save(imageUrl);

        return createdProduct;
    }

    async updateProductWithImage(id: number, createProductDTO: CreateProductDTO, imageFile: Express.Multer.File): Promise<Product> {
        const { productName, brandName, description, price } = createProductDTO;

        const product = await this.productsRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException('상품 정보를 찾을 수 없습니다');
        }

        product.productName = productName;
        product.brandName = brandName;
        product.description = description;
        product.price = price;
        const updatedProduct = await this.productsRepository.save(product);

        const uploadedImageUrl = await this.uploadsService.uploadFile(imageFile, updatedProduct.id);

        const imageUrl = new ImageUrl();
        imageUrl.imageUrl = uploadedImageUrl;
        imageUrl.product = updatedProduct;

        await this.imageUrlsRepository.save(imageUrl);

        return updatedProduct;
    }

    async softDeleteById(productId: number): Promise<void> {
        await this.productsRepository.update({ id: productId }, { isDeleted: true });

        await this.imageUrlsRepository
            .createQueryBuilder()
            .update(ImageUrl)
            .set({ isDeleted: true })
            .where('product = :productId', { productId })
            .execute();
    }
}
