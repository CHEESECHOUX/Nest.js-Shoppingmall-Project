import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '@src/orders/entity/order.entity';

@Entity()
export class PaymentCancel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tossOrderId: string;

    @Column()
    cancelReason: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, comment: '결제 취소 금액' })
    cancelAmount: number;

    @Column()
    bank: string;

    @Column({ nullable: true, comment: '가상계좌 거래 입금 후 취소 건에만 필요' })
    accountNumber: string | null;

    @Column({ nullable: true, comment: '입금자명' })
    holderName: string | null;

    @Column()
    refundableAmount: number;

    @Column({ type: 'datetime' })
    cancelTime: Date;

    @ManyToOne(() => Order, order => order.paymentCancels)
    order: Order;
}
