import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { usersFromDB } from '../../mocks/fixtures';

describe('UsersService', () => {
  let service: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should return an user by username', async () => {
    const validUsername = usersFromDB[0].username;
    const result = await service.findOne(validUsername);

    expect(result).toBeDefined();
  });

  it('should not return an user', async () => {
    const result = await service.findOne('notfound');

    expect(result).toBeUndefined();
  });
});
