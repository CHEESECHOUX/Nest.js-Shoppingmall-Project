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

export class CartInfoDTO {
    @IsNumber()
    cartId: number;
}
export class UpdateCartDTO extends CartInfoDTO {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItemDTO)
    cartItems: CartItemDTO[];
}
