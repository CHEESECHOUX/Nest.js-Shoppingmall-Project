import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { AllExceptionsFilter } from '@src/common/all-exceptions.filter';
import { HttpLoggingInterceptor } from '@src/common/http-logging.interceptor';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: process.env.NODE_ENV === 'production' ? ['error', 'warn', 'log'] : ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    app.useGlobalFilters(new AllExceptionsFilter());

    app.useGlobalInterceptors(new HttpLoggingInterceptor());

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            transformOptions: { enableImplicitConversion: true },
            disableErrorMessages: true,
        }),
    );

    app.enableCors(corsOptions);

    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    await app.listen(3000);
}
bootstrap();
