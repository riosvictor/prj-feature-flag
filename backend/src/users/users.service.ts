import { Injectable } from '@nestjs/common';
import { User } from '../models/user.type';
import { usersFromDB } from '../../mocks/fixtures';

@Injectable()
export class UsersService {
  private readonly users = usersFromDB;

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
