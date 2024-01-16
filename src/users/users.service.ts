import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getUsers() {
    return 'This action returns all users';
  }

  addUser() {
    return 'This action adds a new user';
  }

  updated() {
    return 'This action updates a user';
  },
}
