import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Order } from '@src/orders/entity/order.entity';

export enum PaymentStatusEnum {
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED',
}
@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tossOrderId: string;

    @Column({ comment: '결제수단' })
    method: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, comment: '결제 금액' })
    amount: number;

    @Column()
    status: PaymentStatusEnum;

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;

    @ManyToOne(() => Order, order => order.payments, {
        onDelete: 'CASCADE',
    })
    order: Order;
}
