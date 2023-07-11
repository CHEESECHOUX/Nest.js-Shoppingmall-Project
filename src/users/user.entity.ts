import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

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

    @Column({ default: false })
    isDeleted: boolean;

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;
}
