import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CartsService } from '@src/carts/carts.service';
import { CreateCartDTO, UpdateCartDTO } from '@src/carts/dto/carts.dto';
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
        const cartItem = await this.cartsService.createCart(userId, createCartDTO);
        return cartItem;
    }

    @Patch(':userId')
    async updateCart(@Param('userId') userId: number, @Body() updateCartDTO: UpdateCartDTO): Promise<Cart> {
        const cartItem = await this.cartsService.updateCart(userId, updateCartDTO);
        return cartItem;
    }
}
