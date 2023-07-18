import { IsNumber, IsArray, MinLength } from 'class-validator';

export class CreateCartDTO {
    @IsNumber()
    quantity: number;

    @IsArray()
    productId: number[];
}
