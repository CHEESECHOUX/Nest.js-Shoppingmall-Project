import { Product } from '@src/products/entity/product.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

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

    @Column({ default: 'CUSTOMER' })
    role: string;
    comment: 'ADMIN, MANAGER, CUSTOMER';

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
}
