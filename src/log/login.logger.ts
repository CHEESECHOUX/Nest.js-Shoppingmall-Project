import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersInfoDTO } from '@src/users/dto/users.dto';
import { Logger, createLogger, format, transports } from 'winston';

@Injectable()
export class LoginLogger {
    private logger: Logger;
    private loginLogger: Logger;
    private userInfoLogger: Logger;

    constructor(private configService: ConfigService) {
        const logFilePath = this.configService.get<string>('LOGIN_LOG_FILE_PATH');

        if (!logFilePath) {
            throw new Error('LOGIN_LOG_FILE_PATH 환경 변수가 설정되지 않았습니다');
        }

        const loginLogFileName = 'login.log';
        const loginLogFilePath = logFilePath.replace(/([^\/]*)$/, loginLogFileName);
        this.loginLogger = createLogger({
            level: 'info',
            format: format.combine(format.timestamp(), format.json()),
            transports: [new transports.File({ filename: loginLogFilePath })],
        });

        const userInfoLogFileName = 'userinfo.log';
        const userInfoLogFilePath = logFilePath.replace(/([^\/]*)$/, userInfoLogFileName);
        this.userInfoLogger = createLogger({
            level: 'info',
            format: format.combine(format.timestamp(), format.json()),
            transports: [new transports.File({ filename: userInfoLogFilePath })],
        });
    }

    logLogin(userId: number): void {
        this.loginLogger.info(`사용자 id ${userId} 로그인 했습니다`);
    }

    logUserInfo(userInfo: UsersInfoDTO): void {
        this.userInfoLogger.info(`사용자 정보 조회: ${JSON.stringify(userInfo)}`);
    }
}
