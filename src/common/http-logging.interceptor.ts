import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
    private logger = new Logger(HttpLoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const httpContext = context.switchToHttp();

        const { method, originalUrl, query, params, body } = httpContext.getRequest();

        return next.handle().pipe(
            tap(data =>
                this.logger.log(
                    JSON.stringify({
                        request: { method, originalUrl, query, params, body },
                        response: { statusCode: httpContext.getResponse()?.statusCode, data },
                    }),
                ),
            ),
        );
    }
}
