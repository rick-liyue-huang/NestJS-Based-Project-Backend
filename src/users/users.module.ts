import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/mode/entities/Users';
import { Logs } from 'src/mode/entities/Logs';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Logs])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
