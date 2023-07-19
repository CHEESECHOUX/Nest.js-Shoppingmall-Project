import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '@src/orders/entity/order.entity';

@Entity()
export class PaymentCancel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ comment: '가맹점 ID' })
    merchantId: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, comment: '결제 취소 금액' })
    amount: number;

    @Column()
    creditCard: string;

    @Column()
    creditCardNumber: string;

    @Column()
    cancelReason: string;

    @Column({ type: 'datetime' })
    cancelTime: Date;

    @ManyToOne(() => Order, order => order.paymentCancels)
    order: Order;
}
