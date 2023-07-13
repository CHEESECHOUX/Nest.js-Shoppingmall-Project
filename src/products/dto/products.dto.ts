import { IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDTO {
    @IsString()
    productName: string;

    @IsString()
    brandName: string;

    @IsString()
    description: string;

    @IsNumber()
    @Min(0)
    price: number;
}
