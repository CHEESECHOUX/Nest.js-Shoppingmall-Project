import { Module } from '@nestjs/common';
import { OrdersService } from '@src/orders/orders.service';
import { OrdersController } from '@src/orders/orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@src/orders/entity/order.entity';
import { Payment } from '@src/payments/entity/payment.entity';
import { PaymentsService } from '@src/payments/payments.service';
import { User } from '@src/users/entity/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order, Payment, User])],
    providers: [OrdersService, PaymentsService],
    controllers: [OrdersController],
})
export class OrdersModule {}
