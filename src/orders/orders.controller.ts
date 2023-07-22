import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateOrderDTO, OrderInfoDTO, UpdateOrderDTO } from '@src/orders/dto/orders.dto';
import { OrdersService } from '@src/orders/orders.service';
import { Order } from '@src/orders/entity/order.entity';
import { CancelTossPaymentDTO } from '@src/payments/dto/payment.dto';
import { JwtAuthGuard } from '@src/users/jwt/jwt.guard';
import { RolesGuard } from '@src/guards/roles.guard';
import { Roles } from '@src/common/decorators/role.decorator';
import { GetUserSession } from '@src/common/decorators/get-user-session.decorator';
import { User } from '@src/users/entity/user.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get(':orderId')
    @Roles('ADMIN', 'MANAGER')
    async getOrderById(@Param('orderId') orderId: number): Promise<OrderInfoDTO | null> {
        return this.ordersService.getOrderById(orderId);
    }

    @Post()
    async createOrder(@GetUserSession() user: User, @Body() createOrderDTO: CreateOrderDTO): Promise<any> {
        return this.ordersService.createOrder(user, createOrderDTO);
    }

    @Post('/cancel')
    async cancelOrder(cancelTossPaymentDTO: CancelTossPaymentDTO): Promise<Order> {
        return this.ordersService.cancelOrder(cancelTossPaymentDTO);
    }

    @Patch(':orderId')
    async updateOrderAddress(@Param('orderId') orderId: number, @Body() updateOrderDTO: UpdateOrderDTO): Promise<Order> {
        return this.ordersService.updateOrderAddress(orderId, updateOrderDTO);
    }
}
