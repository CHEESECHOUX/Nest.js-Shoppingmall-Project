import { IsNumber, IsString } from 'class-validator';

export class CreateCategoryDTO {
    @IsString()
    name: string;
}

export class CategoryInfoDTO {
    @IsNumber()
    id: number;
}
