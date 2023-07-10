import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { Logger as WinstonLogger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
@Controller()
export class AppController {
    constructor(private readonly appService: AppService, @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
