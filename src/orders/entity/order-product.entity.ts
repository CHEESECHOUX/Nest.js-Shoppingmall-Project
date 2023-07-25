import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '@src/orders/entity/order.entity';
import { Product } from '@src/products/entity/product.entity';

@Entity()
export class OrderProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, order => order.orderProducts)
    order: Order;

    @ManyToOne(() => Product, product => product.orderProducts)
    product: Product;
}
