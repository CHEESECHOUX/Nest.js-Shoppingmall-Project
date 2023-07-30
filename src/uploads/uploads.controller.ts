import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '@src/common/decorators/role.decorator';
import { UploadsService } from '@src/uploads/uploads.service';
import { JwtAuthGuard } from '@src/users/jwt/jwt.guard';

@Controller('/uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
    constructor(private readonly uploadsService: UploadsService) {}

    @Post()
    @Roles('ADMIN', 'MANAGER')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file, @Body('productId') productId: number) {
        return this.uploadsService.uploadFile(file, productId);
    }
}
