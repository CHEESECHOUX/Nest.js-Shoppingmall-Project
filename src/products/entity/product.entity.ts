import { Cart } from '@src/carts/entity/carts.entity';
import { Category } from '@src/categories/entity/categories.entity';
import { ImageUrl } from '@src/imageurls/entity/imageurl.entity';
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

    @OneToMany(() => ImageUrl, imageurl => imageurl.product, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    })
    imageUrls: ImageUrl[];

    @OneToMany(() => Category, category => category.product, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    })
    categories: Category[];

    @OneToMany(() => Cart, cart => cart.product, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    })
    carts: Cart[];
}
