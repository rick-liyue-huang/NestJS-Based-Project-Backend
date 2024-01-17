import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Logs } from 'src/mode/entities/Logs';
import { Profiles } from 'src/mode/entities/Profiles';
import { Roles } from 'src/mode/entities/Roles';
import { Users } from 'src/mode/entities/Users';

export default {
  type: 'mysql', // 'postgres
  host: '127.0.0.1',
  port: 3090,
  username: 'root',
  password: 'example',
  database: 'testdb',
  entities: [Users, Profiles, Logs, Roles],
  synchronize: true,
  logging: ['error', 'warn'],
  // logging: false, // ['error'],
} as TypeOrmModuleOptions;
