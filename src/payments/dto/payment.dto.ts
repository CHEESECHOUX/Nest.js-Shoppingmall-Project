import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTossPaymentDTO {
    @IsNotEmpty()
    paymentKey: string;

    @IsNotEmpty()
    orderId: string;

    @IsNotEmpty()
    amount: number;
}

export class CancelTossPaymentDTO {
    @IsNotEmpty()
    paymentKey: string;

    @IsString()
    cancelReason: string;

    @IsNumber()
    cancelAmount: number;

    @IsString()
    bank: string;

    @IsOptional()
    @IsString()
    accountNumber: string;

    @IsOptional()
    @IsString()
    holderName: string;

    @IsNumber()
    refundableAmount: number;
}
