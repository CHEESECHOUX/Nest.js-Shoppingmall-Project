import { CartItem } from '@src/carts/entity/cart-items.entity';
import { Category } from '@src/categories/entity/categories.entity';
import { Imageurl } from '@src/imageurls/entity/imageurl.entity';
import { OrderProduct } from '@src/orders/entity/order-product.entity';
import { Review } from '@src/reviews/entity/reviews.entity';
import { User } from '@src/users/entity/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ comment: '상품명' })
    productName: string;

    @Column({ comment: '상호명' })
    brandName: string;

    @Column()
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    price: number;

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;

    @Column({ default: false })
    isDeleted: boolean;

    @ManyToOne(() => User, user => user.products)
    user: User;

    @OneToMany(() => Imageurl, imageurl => imageurl.product, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    })
    imageurls: Imageurl[];

    @OneToMany(() => Category, category => category.product, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    })
    categories: Category[];

    @OneToMany(() => CartItem, cartItem => cartItem.product, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    })
    cartItems: CartItem[];

    @OneToMany(() => Review, review => review.user, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    })
    reviews: Review[];

    @OneToMany(() => OrderProduct, orderProduct => orderProduct.product)
    orderProducts: OrderProduct[];
}
