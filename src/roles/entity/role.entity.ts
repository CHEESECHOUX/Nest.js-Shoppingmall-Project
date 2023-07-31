import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '@src/users/entity/user-role.entity';

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    role: string;

    @OneToMany(() => UserRole, userRole => userRole.role, {
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
    })
    userRoles: UserRole[];
}
