import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs-extra';

@Injectable()
export class LogFileResetService {
    constructor(private configService: ConfigService) {}

    @Cron('0 34 19 * * *', { timeZone: 'Asia/Seoul' })
    resetLogFile() {
        const userInfoLogFileName = 'userinfo.log';
        const userInfoLogFilePath = this.configService.get<string>('LOG_FILE_PATH').replace(/([^\/]*)$/, userInfoLogFileName);

        fs.unlinkSync(userInfoLogFilePath);
    }
}
