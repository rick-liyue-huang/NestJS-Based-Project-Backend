import { Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/enum/config.enum';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @Get()
  getUsers() {
    console.log(this.configService.get(ConfigEnum.DB));
    console.log(this.configService.get('DB_USER'));
    console.log(this.configService.get('DB_PORT'));
    return this.usersService.getUsers();
  }

  @Post()
  addUser() {
    return this.usersService.addUser();
  }
}
