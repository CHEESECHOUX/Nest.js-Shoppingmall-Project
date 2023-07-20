import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import { PaymentsService } from './payments.service';
import { TossPaymentDTO } from './dto/payment.dto';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Get('/success')
    success(@Res() res: Response): void {
        res.sendFile(path.join(__dirname, '..', 'public', 'success.html'));
    }

    @Post('/toss')
    tossPayment(@Body() tossPaymentDTO: TossPaymentDTO) {
        console.log(tossPaymentDTO);
        return this.paymentsService.tossPayment(tossPaymentDTO);
    }
}
