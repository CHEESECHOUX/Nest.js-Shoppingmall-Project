import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: HttpException | Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof HttpException ? exception.toString() : exception instanceof Error ? exception.message : undefined;

        const responseBody = {
            timestamp: new Date().toISOString(),
            statusCode: status,
            message,
            url: req.url,
        };

        this.logger.error(responseBody, exception instanceof Error ? exception.stack : undefined);

        res.status(status).json(responseBody);
    }
}
