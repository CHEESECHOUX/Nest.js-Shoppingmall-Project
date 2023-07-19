import { User } from '@src/users/entity/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { OrderItem } from '@src/orders/entity/order-item.entity';

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
    totalPrice: number;

    @Column({ default: 'PENDING' })
    status: OrderStatus;

    @Column({ nullable: true })
    iamportIssuedId: string;

    @Column({ nullable: true })
    imaportOrderId: string;

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;

    @Column({ default: false })
    isDeleted: boolean;

    @OneToMany(() => OrderItem, orderItem => orderItem.order, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    })
    orderItems: OrderItem[];

    @ManyToOne(() => User, user => user.orders)
    user: User;
}
