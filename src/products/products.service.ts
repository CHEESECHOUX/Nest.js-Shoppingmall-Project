import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@src/products/entity/product.entity';
import { ILike, Repository } from 'typeorm';
import { CreateProductDTO, ProductInfoDTO } from '@src/products/dto/products.dto';
import { User } from '@src/users/entity/user.entity';
import { UploadsService } from '@src/uploads/uploads.service';
import { Imageurl } from '@src/imageurls/entity/imageurl.entity';
import { CacheService } from '@src/cache/cache.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(Imageurl)
        private imageurlsRepository: Repository<Imageurl>,
        private uploadsService: UploadsService,
        private cacheService: CacheService,
    ) {}

    async getProductById(id: number): Promise<ProductInfoDTO | null> {
        const cachedProduct = await this.cacheService.get(`product:${id}`);
        if (cachedProduct) {
            console.log('캐시에서 상품 정보를 가져왔습니다');

            return JSON.parse(cachedProduct) as ProductInfoDTO;
        }

        const productInfo = await this.productsRepository.findOne({ where: { id } });
        if (!productInfo) {
            throw new NotFoundException('상품을 찾을 수 없습니다');
        }

        await this.cacheService.set(`product:${id}`, JSON.stringify(productInfo), 3600); // 캐시 만료 시간 : 1시간

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
