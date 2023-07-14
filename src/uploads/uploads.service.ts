import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageUrl } from '@src/imageurls/entity/imageUrl.entity';
import { ImageUrlRepository } from '@src/imageurls/imageurls.repository';

const BUCKET_NAME = 'cheesechoux-bucket';

@Injectable()
export class UploadsService {
    constructor(
        @InjectRepository(ImageUrl)
        private readonly imageUrlRepository: Repository<ImageUrlRepository>,
    ) {}

    async uploadFile(file): Promise<string> {
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

            const uploadedFile = new ImageUrl();
            uploadedFile.imageUrl = fileUrl;
            await this.imageUrlRepository.save(uploadedFile);

            return fileUrl;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
