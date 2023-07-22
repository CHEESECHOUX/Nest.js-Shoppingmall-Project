import { User } from '@src/users/entity/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { OrderItem } from '@src/orders/entity/order-item.entity';
import { Payment } from '@src/payments/entity/payment.entity';
import { PaymentCancel } from '@src/payments/entity/payment-cancel.entity';

export type OrderStatus = 'PENDING' | 'DELIVER' | 'COMPLETED' | 'CANCELED';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ comment: '수취인' })
    addressee: string;

    @Column({ comment: '상세주소' })
    address: string;

    @Column()
    zipcode: string;

    @Column()
    phone: string;

    @Column()
    requirement: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalAmount: number;

    @Column({ default: 'PENDING' })
    status: OrderStatus;

    @Column({ nullable: true, comment: '토스페이먼츠 paymentKey' })
    tossPaymentKey: string;

    @Column({ nullable: true, comment: '토스페이먼츠 orderId' })
    tossOrderId: string;

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;

    @Column({ default: false })
    isDeleted: boolean;

    @OneToOne(() => Payment, payment => payment.order)
    payment: Payment;

    @OneToMany(() => PaymentCancel, paymentCancel => paymentCancel.order, {})
    paymentCancels: PaymentCancel[];

    @OneToMany(() => OrderItem, orderItem => orderItem.order, {})
    orderItems: OrderItem[];

    @ManyToOne(() => User, user => user.orders)
    user: User;
}
