import { Body, Controller, Post } from '@nestjs/common';
import { CartsService } from '@src/carts/carts.service';
import { CreateCartDTO } from '@src/carts/dto/carts.dto';

@Controller('carts')
export class CartsController {
    constructor(private readonly cartsService: CartsService) {}

    @Post()
    async createCart(@Body() createCartDTO: CreateCartDTO) {
        const createCart = await this.cartsService.createCart(createCartDTO);
        return createCart;
    }
}
