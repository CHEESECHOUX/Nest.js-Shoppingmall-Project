import { Product } from '@src/products/entity/product.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ImageUrl {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    imageUrl: string;

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;

    @Column({ default: false })
    isDeleted: boolean;

    @ManyToOne(() => Product, product => product.imageUrls)
    product: Product;
}
