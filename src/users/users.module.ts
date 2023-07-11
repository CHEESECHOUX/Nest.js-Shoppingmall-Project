import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from '@src/users/users.service';
import { UsersController } from '@src/users/users.controller';
import { UsersRepository } from '@src/users/users.repository';
import { User } from '@src/users/user.entity';
import { JwtStrategy } from '@src/users/jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        ConfigModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                secret: config.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: config.get('JWT_EXP'),
                },
            }),
        }),
        TypeOrmModule.forFeature([User]),
    ],
    providers: [UsersService, UsersRepository, JwtStrategy],
    controllers: [UsersController],
})
export class UsersModule {}
