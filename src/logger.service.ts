import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Logger, createLogger, format, transports } from 'winston';
import * as winston from 'winston';
import { utilities } from 'nest-winston';
import * as moment from 'moment-timezone';
import * as fs from 'fs';

export enum LoggerType {
    Login = 'loginLogger',
    UserInfo = 'userInfoLogger',
    ProductCache = 'productCacheLogger',
    error = 'errorLogger',
}

@Injectable()
export class LoggerService {
    private logFilePath: string;
    private loginLogger: Logger;
    private userInfoLogger: Logger;
    private productCacheLogger: Logger;
    private errorLogger: Logger;

    constructor() {
        this.logFilePath = process.env.LOG_FILE_PATH;

        if (!this.logFilePath) {
            throw new Error('LOG_FILE_PATH 환경 변수가 설정되지 않았습니다');
        }

        // timezone 서울
        const logFormat = winston.format.combine(
            winston.format((info, opts) => {
                info.timestamp = moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
                return info;
            })(),
            utilities.format.nestLike('log', { prettyPrint: true }),
        );

        this.loginLogger = this.createLogger('login.log', logFormat);
        this.userInfoLogger = this.createLogger('userinfo.log', logFormat);
        this.productCacheLogger = this.createLogger('productCache.log', logFormat);
        this.errorLogger = this.createLogger('error.log', logFormat);
    }

    private createLogger(filename: string, format: winston.Logform.Format): Logger {
        const logFilePath = this.logFilePath.replace(/([^\/]*)$/, filename);
        return createLogger({
            level: 'info',
            format: format,
            transports: [new transports.File({ filename: logFilePath })],
        });
    }

    logLogin(userId: number): void {
        this.loginLogger.info(`로그인`, { userId });
    }

    logUserInfo(userId: number): void {
        this.userInfoLogger.info(`사용자 정보 조회`, { userId });
    }

    logProductCache(productId: number): void {
        this.productCacheLogger.info('캐시에서 상품 정보 조회 시도', { productId });
    }

    logError(type: LoggerType, message: string, error: any): void {
        this[type].error(`[${type}] ${message}`, { error });
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
