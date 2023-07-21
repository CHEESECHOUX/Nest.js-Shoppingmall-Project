import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import { PaymentsService } from '@src/payments/payments.service';
import { TossPaymentDTO } from '@src/payments/dto/payment.dto';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Get('/success')
    success(@Res() res: Response): void {
        res.sendFile(path.join(__dirname, '..', 'public', 'success.html'));
    }

    @Post('/toss')
    tossPayment(@Body() tossPaymentDTO: TossPaymentDTO) {
        return this.paymentsService.tossPayment(tossPaymentDTO);
    }
}
