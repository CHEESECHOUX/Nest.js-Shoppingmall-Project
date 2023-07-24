import { Module } from '@nestjs/common';
import { OrdersService } from '@src/orders/orders.service';
import { OrdersController } from '@src/orders/orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@src/orders/entity/order.entity';
import { Payment } from '@src/payments/entity/payment.entity';
import { PaymentsService } from '@src/payments/payments.service';
import { User } from '@src/users/entity/user.entity';
import { CartItem } from '@src/carts/entity/cart-items.entity';
import { Product } from '@src/products/entity/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order, Payment, User, CartItem, Product])],
    providers: [OrdersService, PaymentsService],
    controllers: [OrdersController],
})
export class OrdersModule {}
