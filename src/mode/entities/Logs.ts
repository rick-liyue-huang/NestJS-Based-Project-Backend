import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users';

@Entity('logs', { schema: 'testdb' })
export class Logs {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'path', length: 255 })
  path: string;

  @Column('varchar', { name: 'method', length: 255 })
  method: string;

  @Column('varchar', { name: 'data', length: 255 })
  data: string;

  @Column('varchar', { name: 'result', length: 255 })
  result: string;

  @ManyToOne(() => Users, (users) => users.logs, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: Users;
}
