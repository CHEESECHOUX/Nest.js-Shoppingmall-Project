import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CreateOrderDTO, UpdateOrderDTO } from '@src/orders/dto/orders.dto';
import { OrdersService } from '@src/orders/orders.service';
import { Order } from '@src/orders/entity/order.entity';
import { CancelTossPaymentDTO } from '@src/payments/dto/payment.dto';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    async createOrder(@Body() createOrderDTO: CreateOrderDTO): Promise<any> {
        return this.ordersService.createOrder(createOrderDTO);
    }

    @Post('/cancel')
    async cancelOrder(@Body() cancelTossPaymentDTO: CancelTossPaymentDTO): Promise<Order> {
        return this.ordersService.cancelOrder(cancelTossPaymentDTO);
    }

    @Patch(':orderId')
    async updateOrderAddress(@Param('orderId') orderId: number, @Body() updateOrderDTO: UpdateOrderDTO): Promise<Order> {
        return this.ordersService.updateOrderAddress(orderId, updateOrderDTO);
    }
}
