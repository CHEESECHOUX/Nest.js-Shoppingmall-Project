import { IsString } from 'class-validator';

export class CreateCategoryDTO {
    @IsString()
    name: string;
}
