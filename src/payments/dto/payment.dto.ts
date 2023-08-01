import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTossPaymentDTO {
    @IsString()
    paymentKey: string;

    @IsString()
    orderId: string;

    @IsNumber()
    amount: number;
}

export class CancelTossPaymentDTO {
    @IsString()
    paymentKey: string;

    @IsString()
    orderId: string;

    @IsString()
    method: string;

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
