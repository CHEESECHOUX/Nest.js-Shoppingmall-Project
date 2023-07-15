import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from '@src/uploads/uploads.service';

@Controller('/uploads')
export class UploadsController {
    constructor(private readonly uploadsService: UploadsService) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file, @Body('productId') productId: number) {
        return this.uploadsService.uploadFile(file, productId);
    }
}
