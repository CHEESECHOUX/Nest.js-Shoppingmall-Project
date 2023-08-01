import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { CartsService } from '@src/carts/carts.service';
import { CartInfoDTO, CreateCartDTO, UpdateCartDTO } from '@src/carts/dto/carts.dto';
import { Cart } from '@src/carts/entity/carts.entity';
import { GetUserRequest } from '@src/common/decorators/get-user-request.decorator';
import { User } from '@src/users/entity/user.entity';
import { JwtAuthGuard } from '@src/users/jwt/jwt.guard';

@Controller('/carts')
@UseGuards(JwtAuthGuard)
export class CartsController {
    constructor(private readonly cartsService: CartsService) {}

    @Get()
    async getCartByUser(@GetUserRequest() user: User): Promise<Cart | null> {
        return this.cartsService.getCartByUser(user);
    }

    @Post()
    async createCart(@GetUserRequest() user: User, @Body() createCartDTO: CreateCartDTO): Promise<Cart> {
        const cartItem = await this.cartsService.createCart(user, createCartDTO);
        return cartItem;
    }

    @Patch()
    async updateCart(@GetUserRequest() user: User, @Body() updateCartDTO: UpdateCartDTO): Promise<Cart> {
        const cartItem = await this.cartsService.updateCart(user, updateCartDTO);
        return cartItem;
    }

    @Delete()
    async softDeleteCart(@GetUserRequest() user: User, @Body() cartInfoDTO: CartInfoDTO): Promise<void> {
        return this.cartsService.softDeleteCart(user, cartInfoDTO);
    }
}
