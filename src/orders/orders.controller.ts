import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDTO } from '@src/orders/dto/orders.dto';
import { OrdersService } from '@src/orders/orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    async createOrder(@Body() createOrderDTO: CreateOrderDTO): Promise<any> {
        return this.ordersService.createOrder(createOrderDTO);
    }
}
