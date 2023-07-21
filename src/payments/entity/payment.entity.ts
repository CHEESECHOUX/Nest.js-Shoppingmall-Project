import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Order } from '@src/orders/entity/order.entity';

export enum PaymentStatus {
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED',
}
@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ comment: '결제수단' })
    method: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, comment: '결제 취소 금액' })
    amount: number;

    @Column()
    status: PaymentStatus;

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;

    @OneToOne(() => Order, order => order.payment)
    order: Order;
}
