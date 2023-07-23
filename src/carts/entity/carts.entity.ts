import { Order } from '@src/orders/entity/order.entity';
import { Product } from '@src/products/entity/product.entity';
import { User } from '@src/users/entity/user.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CartItem } from '@src/carts/entity/cart-item.entity';

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    totalQuantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalAmount: number;

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;

    @Column({ default: false })
    isDeleted: boolean;

    @OneToMany(() => CartItem, cartItem => cartItem.cart, {})
    cartItems: CartItem[];

    @OneToMany(() => Order, Order => Order.createdAt, {})
    orders: Order[];

    @ManyToOne(() => User, user => user.carts)
    user: User;

    @ManyToMany(() => Product, product => product.carts)
    @JoinTable({
        name: 'cart_product',
        joinColumns: [{ name: 'cart_id' }],
        inverseJoinColumns: [{ name: 'product_id' }],
    })
    products: Product[];
}
