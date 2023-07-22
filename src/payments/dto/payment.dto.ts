import { IsNotEmpty } from 'class-validator';

export class TossPaymentDTO {
    @IsNotEmpty()
    tossPaymentKey: string;

    @IsNotEmpty()
    tossOrderId: string;

    @IsNotEmpty()
    amount: number;
}
