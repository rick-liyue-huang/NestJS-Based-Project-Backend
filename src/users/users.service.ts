import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logs } from 'src/mode/entities/Logs';
import { Users } from 'src/mode/entities/Users';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(Logs) private logsRepository: Repository<Logs>,
  ) {}
  findAll() {
    return this.usersRepository.find();
  }

  find(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  findById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(user: Users) {
    const newUser = await this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  update(id: number, user: Partial<Users>) {
    return this.usersRepository.update(id, user);
  }

  delete(id: number) {
    return this.usersRepository.delete(id);
  }

  findProfile(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['profiles'],
    });
  }

  async findUserLogs(id: number) {
    const user = await this.findById(id);
    return this.logsRepository.find({
      where: { user },
      relations: ['user'],
    });
  }

  async findLogsByGroup(id: number) {
    return this.logsRepository
      .createQueryBuilder('logs')
      .select('logs.result', 'result')
      .addSelect('COUNT(logs.result)', 'count')
      .leftJoinAndSelect('logs.user', 'user')
      .where('logs.userId = :id', { id })
      .groupBy('logs.result')
      .orderBy('logs.result', 'DESC')
      .getRawMany();

    // return this.logsRepository.query('select * from logs');
  }
}
