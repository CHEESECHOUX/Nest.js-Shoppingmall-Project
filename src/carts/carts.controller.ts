import { Body, Controller, Param, Post } from '@nestjs/common';
import { CartsService } from '@src/carts/carts.service';
import { CreateCartDTO } from '@src/carts/dto/carts.dto';
import { Cart } from '@src/carts/entity/carts.entity';

@Controller('carts')
export class CartsController {
    constructor(private readonly cartsService: CartsService) {}

    @Post(':userId')
    async createCart(@Param('userId') userId: number, @Body() createCartDTO: CreateCartDTO): Promise<Cart> {
        const cartItem = await this.cartsService.addToCart(userId, createCartDTO);
        return cartItem;
    }
}
