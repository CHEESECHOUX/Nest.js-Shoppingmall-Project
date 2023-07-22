import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTossPaymentDTO {
    @IsNotEmpty()
    @IsString()
    paymentKey: string;

    @IsNotEmpty()
    @IsString()
    orderId: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;
}

export class CancelTossPaymentDTO {
    @IsNotEmpty()
    @IsString()
    paymentKey: string;

    @IsNotEmpty()
    @IsString()
    cancelReason: string;

    @IsNotEmpty()
    @IsNumber()
    cancelAmount: number;

    @IsNotEmpty()
    @IsString()
    bank: string;

    @IsOptional()
    @IsString()
    accountNumber: string;

    @IsOptional()
    @IsString()
    holderName: string;

    @IsNotEmpty()
    @IsNumber()
    refundableAmount: number;
}
