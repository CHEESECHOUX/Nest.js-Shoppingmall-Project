import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@src/products/entity/product.entity';
import { ILike, Repository } from 'typeorm';
import { CreateProductDTO, ProductInfoDTO } from '@src/products/dto/products.dto';
import { User } from '@src/users/entity/user.entity';
import { UploadsService } from '@src/uploads/uploads.service';
import { Imageurl } from '@src/imageurls/entity/imageurl.entity';
import { CacheService } from '@src/cache/cache.service';
import { LoggerService, LoggerType } from '@src/logger.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        private cacheService: CacheService,
        private productCacheLogger: LoggerService,
        @InjectRepository(Imageurl)
        private imageurlsRepository: Repository<Imageurl>,
        private uploadsService: UploadsService,
    ) {}

    async getProductById(id: number): Promise<ProductInfoDTO | null> {
        // 캐시로 상품 정보 조회 후 로그 파일에 기록
        const cachedProduct = await this.cacheService.get(`product:${id}`);

        if (cachedProduct) {
            await this.productCacheLogger.logProductCache(id);

            return JSON.parse(cachedProduct) as ProductInfoDTO;
        }

        const productInfo = await this.productsRepository.findOne({ where: { id } });

        if (!productInfo) {
            throw new NotFoundException('상품을 찾을 수 없습니다');
        }

        try {
            // 캐시에 상품 정보 저장 (만료 시간 : 1시간)
            await this.cacheService.set(`product:${id}`, JSON.stringify(productInfo), 3600);
        } catch (error) {
            // 캐시에 상품 저장이 실패했을 때, 로그 파일에 오류 기록
            await this.productCacheLogger.logError(LoggerType.ProductCache, `캐시에 상품 정보 저장 오류`, error);
        }

        return productInfo;
    }

    async getProductsByName(productName: string): Promise<Product[]> {
        const cachedProduct = await this.cacheService.get(`product:${productName}`);
        if (cachedProduct) {
            console.log('캐시에서 상품 정보를 가져왔습니다');

            return JSON.parse(cachedProduct);
        }

        const products = await this.productsRepository.find({
            where: { productName: ILike(`%${productName}%`) },
        });

        await this.cacheService.set(`product:${productName}`, JSON.stringify(products), 3600);

        return products;
    }

    async getProductsByCategory(categoryId: number): Promise<Product[]> {
        const cachedProducts = await this.cacheService.get(`category:${categoryId}`);

        if (cachedProducts) {
            console.log('캐시에서 상품 정보를 가져왔습니다');

            return JSON.parse(cachedProducts);
        }

        const products = await this.productsRepository
            .createQueryBuilder('product')
            .innerJoin('product.categories', 'category')
            .where('category.id = :categoryId', { categoryId })
            .orderBy('product.productName', 'ASC')
            .take(20)
            .getMany();

        await this.cacheService.set(`category:${categoryId}`, JSON.stringify(products), 3600);

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

        const imageUrl = new Imageurl();
        imageUrl.imageUrl = uploadedImageUrl;
        imageUrl.product = createdProduct;

        await this.imageurlsRepository.save(imageUrl);

        return createdProduct;
    }

    async updateProductWithImage(productId: number, createProductDTO: CreateProductDTO, imageFile: Express.Multer.File): Promise<Product> {
        const { productName, brandName, description, price } = createProductDTO;

        const product = await this.productsRepository.findOne({ where: { id: productId } });
        if (!product) {
            throw new NotFoundException('상품 정보를 찾을 수 없습니다');
        }

        product.productName = productName;
        product.brandName = brandName;
        product.description = description;
        product.price = price;
        const updatedProduct = await this.productsRepository.save(product);

        // 상품 정보 업데이트 시 해당 상품 캐시 삭제
        await this.cacheService.del(`product:${productId}`);
        await this.cacheService.del(`product:${productName}`);

        // 상품 정보 업데이트 시 해당 상품의 카테고리 캐시 삭제
        const categoryOfProduct = await this.productsRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.categories', 'category')
            .where('product.id = :id', { id: productId })
            .getOne();

        if (categoryOfProduct && categoryOfProduct.categories) {
            for (const category of categoryOfProduct.categories) {
                await this.cacheService.del(`category:${category.id}`);
            }
        }

        const uploadedImageUrl = await this.uploadsService.uploadFile(imageFile, updatedProduct.id);

        const imageUrl = new Imageurl();
        imageUrl.imageUrl = uploadedImageUrl;
        imageUrl.product = updatedProduct;

        await this.imageurlsRepository.save(imageUrl);

        return updatedProduct;
    }

    async softDeleteById(productId: number): Promise<void> {
        await this.productsRepository.update({ id: productId }, { isDeleted: true });

        await this.imageurlsRepository
            .createQueryBuilder()
            .update(Imageurl)
            .set({ isDeleted: true })
            .where('product = :productId', { productId })
            .execute();
    }

    async hardDeleteImagesByProductId(productId: number): Promise<void> {
        await this.imageurlsRepository.createQueryBuilder().delete().from(Imageurl).where('product = :productId', { productId }).execute();
    }
}
