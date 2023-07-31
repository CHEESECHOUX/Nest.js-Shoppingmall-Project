import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@src/users/entity/user.entity';
import { Role } from '@src/roles/entity/role.entity';

@Entity()
export class UserRole {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.userRoles, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Role, role => role.userRoles, { onDelete: 'CASCADE' })
    role: Role;
}
