import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

const BUCKET_NAME = 'cheesechoux-bucket';

@Injectable()
export class UploadsService {
    async uploadFile(file) {
        AWS.config.update({
            region: 'ap-northeast-2',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
            },
        });

        try {
            const upload = await new AWS.S3()
                .putObject({
                    Key: `${Date.now() + file.originalname}`,
                    Body: file.buffer,
                    Bucket: BUCKET_NAME,
                })
                .promise();
            console.log(upload);
            return upload;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
