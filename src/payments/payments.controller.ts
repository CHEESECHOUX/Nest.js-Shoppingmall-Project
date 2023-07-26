import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import { PaymentsService } from '@src/payments/payments.service';
import { CancelTossPaymentDTO, CreateTossPaymentDTO } from '@src/payments/dto/payment.dto';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Get('/success')
    success(@Res() res: Response): void {
        res.sendFile(path.join(__dirname, '..', 'public', 'success.html'));
    }

    @Post('/toss')
    tossPaymentKey(@Body() createTossPaymentDTO: CreateTossPaymentDTO) {
        return this.paymentsService.tossPaymentKey(createTossPaymentDTO);
    }

    @Post('/toss/cancel')
    cancel(@Body() cancelTossPaymentDTO: CancelTossPaymentDTO) {
        return this.paymentsService.cancelTossPayment(cancelTossPaymentDTO);
    }
}
