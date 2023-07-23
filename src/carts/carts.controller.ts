import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CartsService } from '@src/carts/carts.service';
import { CartInfoDTO, CreateCartDTO, UpdateCartDTO } from '@src/carts/dto/carts.dto';
import { Cart } from '@src/carts/entity/carts.entity';
import { GetUserSession } from '@src/common/decorators/get-user-session.decorator';
import { User } from '@src/users/entity/user.entity';
import { JwtAuthGuard } from '@src/users/jwt/jwt.guard';

@Controller('/carts')
@UseGuards(JwtAuthGuard)
export class CartsController {
    constructor(private readonly cartsService: CartsService) {}

    @Get('')
    async getCartByUser(@GetUserSession() user: User): Promise<Cart | null> {
        return this.cartsService.getCartByUser(user);
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

    @Delete('/item/:userId')
    async softDeleteCartItem(@Param('userId') userId: number, @Body() updateCartDTO: UpdateCartDTO): Promise<Cart> {
        const cartItem = await this.cartsService.softDeleteCartItem(userId, updateCartDTO);
        return cartItem;
    }

    @Delete(':userId')
    async softDeleteCart(@Param('userId') userId: number, @Body() cartInfoDTO: CartInfoDTO): Promise<void> {
        return this.cartsService.softDeleteCart(userId, cartInfoDTO);
    }
}
