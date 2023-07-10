import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { AllExceptionsFilter } from '@src/common/all-exceptions.filter';
import { HttpLoggingInterceptor } from '@src/common/http-logging.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
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

    await app.listen(3000);
}
bootstrap();
