import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users';

@Entity('roles', { schema: 'testdb' })
export class Roles {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @ManyToMany(() => Users, (users) => users.roles)
  @JoinTable({
    name: 'users_roles',
    joinColumns: [{ name: 'rolesId', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'usersId', referencedColumnName: 'id' }],
    schema: 'testdb',
  })
  users: Users[];
}
