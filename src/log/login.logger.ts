import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserInfoDTO } from '@src/users/dto/users.dto';
import { Logger, createLogger, format, transports } from 'winston';
import { LogFileResetService } from '@src/log/log-file-reset.service';
@Injectable()
export class LoginLogger {
    private loginLogger: Logger;
    private userInfoLogger: Logger;
    private logFileResetService: LogFileResetService;
    private logFilePath: string;

    constructor(private configService: ConfigService, logFileResetService: LogFileResetService) {
        this.logFilePath = this.configService.get<string>('LOG_FILE_PATH');

        if (!this.logFilePath) {
            throw new Error('LOG_FILE_PATH 환경 변수가 설정되지 않았습니다');
        }

        const loginLogFileName = 'login.log';
        const loginLogFilePath = this.logFilePath.replace(/([^\/]*)$/, loginLogFileName);
        this.loginLogger = createLogger({
            level: 'info',
            format: format.combine(format.timestamp(), format.json()),
            transports: [new transports.File({ filename: loginLogFilePath })],
        });

        const userInfoLogFileName = 'userinfo.log';
        const userInfoLogFilePath = this.logFilePath.replace(/([^\/]*)$/, userInfoLogFileName);
        this.userInfoLogger = createLogger({
            level: 'info',
            format: format.combine(format.timestamp(), format.json()),
            transports: [new transports.File({ filename: userInfoLogFilePath })],
        });
        this.logFileResetService = logFileResetService;
    }

    logLogin(userId: number): void {
        this.loginLogger.info(`사용자 id ${userId} 로그인 했습니다`);
    }

    logUserInfo(userInfo: UserInfoDTO): void {
        this.userInfoLogger.info(`사용자 정보 조회: ${JSON.stringify(userInfo)}`);
    }

    // 매일 자정 UserInfoLog 데이터 초기화
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async resetUserInfoLog(): Promise<void> {
        const userInfoLogFileName = 'userinfo.log';
        const userInfoLogFilePath = this.logFilePath.replace(/([^\/]*)$/, userInfoLogFileName);

        const newUserInfoLogger = createLogger({
            level: 'info',
            format: format.combine(format.timestamp(), format.json()),
            transports: [new transports.File({ filename: userInfoLogFilePath })],
        });

        await this.logFileResetService.resetLogFile();

        this.userInfoLogger = newUserInfoLogger;
    }
}
