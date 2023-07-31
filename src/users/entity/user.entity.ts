import { Cart } from '@src/carts/entity/carts.entity';
import { Order } from '@src/orders/entity/order.entity';
import { Product } from '@src/products/entity/product.entity';
import { Review } from '@src/reviews/entity/reviews.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { UserRole } from '@src/users/entity/user-role.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Unique(['loginId'])
    loginId: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    @Unique(['email'])
    email: string;

    @Column()
    @Unique(['phone'])
    phone: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    zipcode: string;

    @Column({ nullable: true })
    address: string;

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;

    @Column({ default: false })
    isDeleted: boolean;

    @OneToMany(() => Product, product => product.user, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    })
    products: Product[];

    @OneToMany(() => Cart, cart => cart.user, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    })
    carts: Cart[];

    @OneToMany(() => Order, order => order.user, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    })
    orders: Order[];

    @OneToMany(() => Review, review => review.user, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    })
    reviews: Review[];

    @OneToMany(() => UserRole, userRole => userRole.user, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    })
    userRoles: UserRole[];
}
