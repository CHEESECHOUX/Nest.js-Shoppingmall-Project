import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '@src/products/entity/product.entity';
import { Cart } from '@src/carts/entity/carts.entity';

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @Column()
    totalAmount: number;

    @ManyToOne(() => Cart, cart => cart.cartItems)
    cart: Cart;

    @ManyToOne(() => Product, product => product.cartItems)
    product: Product;
}
