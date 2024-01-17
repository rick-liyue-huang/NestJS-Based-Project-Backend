import { Controller, Delete, Get, Patch, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
// import { ConfigService } from '@nestjs/config';
// import { ConfigEnum } from 'src/enum/config.enum';
import { Users } from 'src/mode/entities/Users';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    // private configService: ConfigService,
  ) {}

  @Get()
  getUsers() {
    // console.log(this.configService.get(ConfigEnum.DB_HOST));
    // console.log(this.configService.get(ConfigEnum.DB_PORT));
    return this.usersService.findAll();
  }

  @Post()
  async addUser(@Req() req: Request, @Res() res: Response) {
    const user = req.body as Users;
    const newUser = await this.usersService.create(user);
    res.send(newUser);
  }

  @Patch(':id')
  async updateUser(@Req() req: Request, @Res() res: Response) {
    const id = parseInt(req.params.id);
    const user = req.body as Partial<Users>;
    const updatedUser = await this.usersService.update(id, user);
    res.send(updatedUser);
  }

  @Delete(':id')
  async deleteUser(@Req() req: Request, @Res() res: Response) {
    const id = parseInt(req.params.id);
    await this.usersService.delete(id);
    res.sendStatus(204);
  }

  @Get(':id/profile')
  async getUserProfile(@Req() req: Request, @Res() res: Response) {
    const id = parseInt(req.params.id);
    const user = await this.usersService.findProfile(id);
    res.send(user);
  }

  @Get(':id/logs')
  async getUserLogs(@Req() req: Request, @Res() res: Response) {
    const id = parseInt(req.params.id);
    const user = await this.usersService.findUserLogs(id);
    res.send(user);
  }

  @Get(':id/logs/group')
  async getUserLogsGroup(@Req() req: Request, @Res() res: Response) {
    const id = parseInt(req.params.id);
    const user = await this.usersService.findLogsByGroup(id);
    res.send(user.map((item) => ({ result: item.result, count: item.count })));
  }
}
