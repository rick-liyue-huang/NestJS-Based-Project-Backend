import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users';

@Entity('profiles', { schema: 'testdb' })
export class Profiles {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'gender', length: 255 })
  gender: string;

  @Column('varchar', { name: 'photo', length: 255 })
  photo: string;

  @Column('varchar', { name: 'address', length: 255 })
  address: string;

  @OneToOne(() => Users, (users) => users.profiles, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: Users;
}
