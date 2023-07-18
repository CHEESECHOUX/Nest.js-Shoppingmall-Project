import { Type } from 'class-transformer';
import { IsNumber, IsArray, ValidateNested } from 'class-validator';

class CartItemDTO {
    @IsNumber()
    productId: number;

    @IsNumber()
    quantity: number;
}
export class CreateCartDTO {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItemDTO)
    cartItems: CartItemDTO[];
}
