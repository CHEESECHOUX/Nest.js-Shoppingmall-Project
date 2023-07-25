import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDTO {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsNumber()
    productId: number;
}
