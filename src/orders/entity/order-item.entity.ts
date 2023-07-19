import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '@src/orders/entity/order.entity';
import { Product } from '@src/products/entity/product.entity';

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ comment: '주문 상품명' })
    orderProductName: string;

    @Column()
    quantity: number;

    @Column()
    totalPrice: number;

    @ManyToOne(() => Order, order => order.orderItems)
    order: Order;

    @ManyToOne(() => Product, product => product.orderItems)
    product: Product;
}
