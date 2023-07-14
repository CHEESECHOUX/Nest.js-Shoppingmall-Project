import { Product } from '@src/products/entity/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ImageUrl {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    imageUrl: string;

    @ManyToOne(() => Product, product => product.imageUrls)
    product: Product;
}
