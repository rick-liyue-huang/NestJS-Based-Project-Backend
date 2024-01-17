import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Logs } from './Logs';
import { Profiles } from './Profiles';
import { Roles } from './Roles';

@Entity('users', { schema: 'testdb' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'username', length: 255 })
  username: string;

  @Column('varchar', { name: 'password', length: 255 })
  password: string;

  @OneToMany(() => Logs, (logs) => logs.user)
  logs: Logs[];

  @OneToOne(() => Profiles, (profiles) => profiles.user)
  profiles: Profiles;

  @ManyToMany(() => Roles, (roles) => roles.users)
  roles: Roles[];
}
