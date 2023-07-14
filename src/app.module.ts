import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import * as Joi from 'joi';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import { UsersModule } from '@src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ScheduleModule } from '@nestjs/schedule';
import { LogFileResetService } from '@src/log/log-file-reset.service';
import { LoginLogger } from '@src/log/login.logger';
import { ProductsModule } from '@src/products/products.module';
import { UploadsModule } from './uploads/uploads.module';
import { ImageurlsModule } from './imageurls/imageurls.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `${__dirname}/config/.${process.env.NODE_ENV}.env`,
            validationSchema: Joi.object({
                NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
                PORT: Joi.number().default(3000),
            }),
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
                autoLoadEntities: true,
                logging: false,
                namingStrategy: new SnakeNamingStrategy(),
            }),
        }),
        WinstonModule.forRoot({
            transports: [
                new winston.transports.Console({
                    level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.ms(),
                        nestWinstonModuleUtilities.format.nestLike(process.env.APP_NAME, {
                            colors: true,
                            prettyPrint: true,
                        }),
                    ),
                }),
                new winstonDaily({
                    level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
                    format: winston.format.combine(
                        winston.format.timestamp({
                            format: 'YYYY-MM-DD HH:mm:ss',
                        }),
                        winston.format.printf(info => `[${info.timestamp}] ${process.env.APP_NAME}.${info.level}: ${info.message}`),
                    ),
                    dirname: `${process.cwd()}/src/logs`,
                    filename: '%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                }),
            ],
        }),
        ScheduleModule.forRoot(),
        UsersModule,
        ProductsModule,
        UploadsModule,
        ImageurlsModule,
    ],
    controllers: [AppController],
    providers: [AppService, LoginLogger, LogFileResetService],
})
export class AppModule {}
