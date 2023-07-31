import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { UserInfoDTO } from '@src/users/dto/users.dto';
import { Logger, createLogger, format, transports } from 'winston';
import * as winston from 'winston';
import { utilities } from 'nest-winston';
import * as moment from 'moment-timezone';
import * as fs from 'fs';

@Injectable()
export class LoggerService {
    private loginLogger: Logger;
    private userInfoLogger: Logger;
    private logFilePath: string;

    constructor(private configService: ConfigService) {
        this.logFilePath = this.configService.get<string>('LOG_FILE_PATH');

        if (!this.logFilePath) {
            throw new Error('LOG_FILE_PATH 환경 변수가 설정되지 않았습니다');
        }

        // timezone 서울
        const format = winston.format.combine(
            winston.format((info, opts) => {
                info.timestamp = moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
                return info;
            })(),
            utilities.format.nestLike('log', { prettyPrint: true }),
        );

        const loginLogFileName = 'login.log';
        const loginLogFilePath = this.logFilePath.replace(/([^\/]*)$/, loginLogFileName);
        this.loginLogger = createLogger({
            level: 'info',
            format: format,
            transports: [new transports.File({ filename: loginLogFilePath })],
        });

        const userInfoLogFileName = 'userinfo.log';
        const userInfoLogFilePath = this.logFilePath.replace(/([^\/]*)$/, userInfoLogFileName);
        this.userInfoLogger = createLogger({
            level: 'info',
            format: format,
            transports: [new transports.File({ filename: userInfoLogFilePath })],
        });
    }

    logLogin(userId: number): void {
        this.loginLogger.info(`사용자 id ${userId} 로그인 했습니다`);
    }

    logUserInfo(userInfo: UserInfoDTO): void {
        this.userInfoLogger.info(`사용자 정보 조회: ${JSON.stringify(userInfo)}`);
    }

    // 매일 자정 UserInfoLog 데이터 초기화
    @Cron('0 00 00 * * *', { timeZone: 'Asia/Seoul' })
    async resetUserInfoLog(): Promise<void> {
        try {
            const userInfoLogFileName = 'userinfo.log';
            const userInfoLogFilePath = this.logFilePath.replace(/([^\/]*)$/, userInfoLogFileName);

            if (fs.existsSync(userInfoLogFilePath)) {
                fs.unlinkSync(userInfoLogFilePath);
            }

            const newUserInfoLogger = createLogger({
                level: 'info',
                format: format.combine(format.timestamp(), format.json()),
                transports: [new transports.File({ filename: userInfoLogFilePath })],
            });

            this.userInfoLogger = newUserInfoLogger;
        } catch (error) {
            console.error('userInfoLog 초기화 실패:', error);
        }
    }
}
