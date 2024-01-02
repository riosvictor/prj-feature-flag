import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../models/user.type';

describe('AuthController', () => {
  let controller: AuthController;
  let usersService: UsersService;
  const authUser: User = {
    id: 1,
    username: 'test',
    password: 'test',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'secret' })],
      controllers: [AuthController],
      providers: [AuthService, UsersService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should return jwt token', async () => {
    jest.spyOn(usersService, 'findOne').mockResolvedValueOnce(authUser);

    const result = await controller.singIn({
      username: authUser.username,
      password: authUser.password,
    });

    expect(result).toEqual({ access_token: expect.any(String) });
  });

  it('should return unauthorized', async () => {
    jest.spyOn(usersService, 'findOne').mockResolvedValueOnce(authUser);

    await expect(
      controller.singIn({
        username: 'potato',
        password: 'fries potato',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
