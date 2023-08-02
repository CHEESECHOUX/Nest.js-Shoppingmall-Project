import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Imageurl } from '@src/imageurls/entity/imageurl.entity';

@Injectable()
export class ImageurlsRepository {
    constructor(
        @InjectRepository(Imageurl)
        private readonly repository: Repository<Imageurl>,
    ) {}

    save(imageUrl: Imageurl) {
        return this.repository.save(imageUrl);
    }
}
