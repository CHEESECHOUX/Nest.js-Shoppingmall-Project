import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageUrl } from '@src/imageurls/entity/imageurl.entity';

@Injectable()
export class ImageUrlsRepository {
    constructor(
        @InjectRepository(ImageUrl)
        private readonly repository: Repository<ImageUrl>,
    ) {}

    save(imageUrl: ImageUrl) {
        return this.repository.save(imageUrl);
    }
}
