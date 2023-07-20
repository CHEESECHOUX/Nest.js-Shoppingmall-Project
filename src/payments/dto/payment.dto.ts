import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDTO {
    @IsString()
    creditCard: string;

    @IsNumber()
    amount: number;

    @IsString()
    status: string;
}

export class CreatePaymentCancelDTO {
    @IsString()
    merchantId: string;

    @IsNumber()
    amount: number;

    @IsString()
    creditCard: string;

    @IsString()
    creditCartNumber: string;

    @IsString()
    cancelReason: string;

    @IsDate()
    cancelTime: Date;
}

export class TossPaymentDTO {
    @IsNotEmpty()
    paymentKey: string;

    @IsNotEmpty()
    orderId: string;

    @IsNotEmpty()
    amount: number;
}
