import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateOrderDTO, OrderInfoDTO, UpdateOrderDTO } from '@src/orders/dto/orders.dto';
import { OrdersService } from '@src/orders/orders.service';
import { Order, OrderStatusEnum } from '@src/orders/entity/order.entity';
import { CancelTossPaymentDTO } from '@src/payments/dto/payment.dto';
import { JwtAuthGuard } from '@src/users/jwt/jwt.guard';
import { RolesGuard } from '@src/guards/roles.guard';
import { Roles } from '@src/common/decorators/role.decorator';
import { GetUserRequest } from '@src/common/decorators/get-user-request.decorator';
import { User } from '@src/users/entity/user.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get('/:orderId')
    @Roles('ADMIN', 'MANAGER')
    async getOrderById(@Param('orderId') orderId: number): Promise<OrderInfoDTO | null> {
        return this.ordersService.getOrderById(orderId);
    }

    @Get('/my/:orderId')
    async getOrderByUser(@GetUserRequest() user: User, @Param('orderId', ParseIntPipe) orderId: number): Promise<OrderInfoDTO | null> {
        return this.ordersService.getOrderByUser(user, orderId);
    }

    @Post()
    async createOrder(@GetUserRequest() user: User, @Body() createOrderDTO: CreateOrderDTO): Promise<Order> {
        return this.ordersService.createOrder(user, createOrderDTO);
    }

    @Post('/cancel')
    async cancelOrder(@Body() cancelTossPaymentDTO: CancelTossPaymentDTO): Promise<Order> {
        return this.ordersService.cancelOrder(cancelTossPaymentDTO);
    }

    @Patch(':orderId')
    async updateOrderAddress(
        @GetUserRequest() user: User,
        @Param('orderId', ParseIntPipe) orderId: number,
        @Body() updateOrderDTO: UpdateOrderDTO,
    ): Promise<Order> {
        return this.ordersService.updateOrderAddress(user, orderId, updateOrderDTO);
    }

    @Patch(':orderId/status')
    @Roles('ADMIN', 'MANAGER')
    async updateOrderStatus(@Param('orderId', ParseIntPipe) orderId: number, @Body('status') status: OrderStatusEnum) {
        return this.ordersService.updateOrderStatus(orderId, status);
    }
}
