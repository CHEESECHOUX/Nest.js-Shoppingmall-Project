import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger, createLogger, format, transports } from 'winston';

@Injectable()
export class LoginLogger {
    private logger: Logger;

    constructor(private configService: ConfigService) {
        const logFilePath = this.configService.get<string>('LOGIN_LOG_FILE_PATH');

        if (!logFilePath) {
            throw new Error('LOGIN_LOG_FILE_PATH 환경 변수가 설정되지 않았습니다');
        }
        this.logger = createLogger({
            level: 'info',
            format: format.combine(format.timestamp(), format.json()),
            transports: [new transports.File({ filename: logFilePath })],
        });
    }

    logLogin(userId: number): void {
        this.logger.info(`사용자 id ${userId} 로그인 했습니다`);
    }
}
