import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageUrl } from '@src/imageurls/entity/imageurl.entity';
import { Product } from '@src/products/entity/product.entity';

const BUCKET_NAME = 'cheesechoux-bucket';

@Injectable()
export class UploadsService {
    constructor(
        @InjectRepository(ImageUrl)
        private readonly imageUrlsRepository: Repository<ImageUrl>,
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>,
    ) {}

    async uploadFile(file, productId: number): Promise<string> {
        AWS.config.update({
            region: 'ap-northeast-2',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
            },
        });

        try {
            const s3 = new AWS.S3();
            const key = `${Date.now() + file.originalname}`;

            await s3
                .putObject({
                    Key: key,
                    Body: file.buffer,
                    Bucket: BUCKET_NAME,
                })
                .promise();

            const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;

            const product = await this.productsRepository.findOne({ where: { id: productId } });
            if (!product) {
                throw new Error(`이미지 파일에 맞는 상품 ID: ${productId} 찾을 수 없습니다`);
            }

            const uploadedFile = new ImageUrl();
            uploadedFile.imageUrl = fileUrl;
            uploadedFile.product = product;
            await this.imageUrlsRepository.save(uploadedFile);

            return fileUrl;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
