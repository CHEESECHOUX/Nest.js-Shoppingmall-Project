import { Module } from '@nestjs/common';
import { CacheController } from '@src/cache/cache.controller';
import { CacheService } from '@src/cache/cache.service';
import { RedisModule, RedisService } from '@liaoliaots/nestjs-redis';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '@src/users/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        RedisModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService, RedisService],
            useFactory: async (config: ConfigService) => ({
                secret: config.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: config.get('JWT_EXP'),
                },
            }),
        }),
        TypeOrmModule.forFeature([User]),
    ],

    controllers: [CacheController],
    providers: [CacheService],
})
export class CacheModule {}
