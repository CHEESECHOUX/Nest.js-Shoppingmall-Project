import { IsNumber } from 'class-validator';

export class CreateCartDTO {
    @IsNumber()
    quantity: number;

    @IsNumber()
    userId: number;

    @IsNumber()
    productId: number;
}
