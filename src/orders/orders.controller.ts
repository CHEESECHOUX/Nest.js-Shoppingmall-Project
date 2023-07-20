import { Controller } from '@nestjs/common';
import { OrdersService } from '@src/orders/orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}
}
