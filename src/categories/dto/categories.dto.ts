import { IsNumber, IsString } from 'class-validator';

export class CategoryInfoDTO {
    @IsNumber()
    id: number;
}

export class CreateCategoryDTO {
    @IsString()
    name: string;
}

export class CreateCategoryWithProductDTO {
    @IsString()
    name: string;

    @IsNumber()
    productId: number;
}
