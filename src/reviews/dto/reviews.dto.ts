import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDTO {
    @IsNotEmpty()
    @IsString()
    review: string;

    @IsNotEmpty()
    @IsNumber()
    productId: number;
}
