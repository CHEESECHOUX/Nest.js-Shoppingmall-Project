import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class CacheService {
    private readonly redisClient: Redis;

    constructor(private readonly redisService: RedisService) {
        this.redisClient = redisService.getClient();
    }

    get(key: string): Promise<string> {
        return this.redisClient.get(key);
    }

    set(key: string, value: string, expire?: number): Promise<'OK'> {
        return this.redisClient.set(key, value, 'EX', expire ?? 3600);
    }

    del(key: string): Promise<number> {
        return this.redisClient.del(key);
    }
}
