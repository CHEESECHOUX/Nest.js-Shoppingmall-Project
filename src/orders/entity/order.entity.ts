import { User } from '@src/users/entity/user.entity';
import { Column, CreateDateColumn, Entity, Generated, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Payment } from '@src/payments/entity/payment.entity';
import { PaymentCancel } from '@src/payments/entity/payment-cancel.entity';
import { Cart } from '@src/carts/entity/carts.entity';

export enum OrderStatusEnum {
    PENDING = 'PENDING',
    PREPARE_DELIVER = 'PREPARE_DELIVER',
    DELIVER = 'DELIVER',
    COMPLETE_DELIVER = 'COMPLETE_DELIVER',
    CONFIRM_PURCHASE = 'CONFIRM_PURCHASE',
    CANCELED = 'CANCELED',
}

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
    status: OrderStatusEnum;

    @Column({ comment: '토스페이먼츠 paymentKey', nullable: true })
    tossPaymentKey: string;

    @Column({ comment: '토스 페이먼츠 orderId', nullable: true })
    @Generated('uuid')
    tossOrderId: string;

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;

    @Column({ default: false })
    isDeleted: boolean;

    @OneToMany(() => Payment, Payment => Payment.order, {})
    payments: Payment[];

    @OneToMany(() => PaymentCancel, paymentCancel => paymentCancel.order, {})
    paymentCancels: PaymentCancel[];

    @ManyToOne(() => User, user => user.orders)
    user: User;

    @ManyToOne(() => Cart, cart => cart.orders)
    cart: Cart;
}
