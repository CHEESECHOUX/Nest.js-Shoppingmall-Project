import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from '@src/users/users.service';
import { UsersController } from '@src/users/users.controller';
import { UsersRepository } from '@src/users/users.repository';
import { User } from '@src/users/entity/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@src/users/jwt/jwt.strategy';
import { LoggerService } from '@src/logger.service';
import { Cart } from '@src/carts/entity/carts.entity';
import { Role } from '@src/roles/entity/role.entity';
import { UserRole } from '@src/users/entity/user-role.entity';
import { RedisModule, RedisService } from '@liaoliaots/nestjs-redis';
import { RedisConfigService } from '@src/config/redis-config.service';
import { CacheService } from '@src/cache/cache.service';

@Module({
    imports: [
        ConfigModule,
        PassportModule,
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
        RedisModule.forRootAsync({
            useClass: RedisConfigService,
        }),
        TypeOrmModule.forFeature([User, Cart, Role, UserRole]),
    ],
    providers: [UsersService, UsersRepository, JwtStrategy, LoggerService, CacheService],
    controllers: [UsersController],
})
export class UsersModule {}
