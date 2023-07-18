import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CartsService } from '@src/carts/carts.service';
import { CreateCartDTO } from '@src/carts/dto/carts.dto';
import { Cart } from '@src/carts/entity/carts.entity';

@Controller('carts')
export class CartsController {
    constructor(private readonly cartsService: CartsService) {}

    @Get(':id')
    async getCart(@Param('id') id: number) {
        return this.cartsService.getCartByUserId(id);
    }

    @Post(':userId')
    async createCart(@Param('userId') userId: number, @Body() createCartDTO: CreateCartDTO): Promise<Cart> {
        const cartItem = await this.cartsService.addToCart(userId, createCartDTO);
        return cartItem;
    }
}
