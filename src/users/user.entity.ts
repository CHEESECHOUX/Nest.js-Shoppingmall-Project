import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
@Unique(['loginId', 'email', 'phone'])
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column()
    loginId: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    email: string;

    @Column()
    phone: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    zipcode: string;

    @Column({ nullable: true })
    address: string;

    @Column({ default: false })
    isDeleted: boolean;

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;
}
