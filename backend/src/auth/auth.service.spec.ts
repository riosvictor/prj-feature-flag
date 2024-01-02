import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'secret' })],
      providers: [AuthService, UsersService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should return an access token', async () => {
    jest.spyOn(usersService, 'findOne').mockResolvedValueOnce({
      id: 1,
      username: 'test',
      password: 'test',
    });

    const result = await service.singIn('test', 'test');

    expect(result).toHaveProperty('access_token');
    expect(typeof result.access_token).toBe('string');
  });

  it('should throws an unauthorized error', async () => {
    await expect(service.singIn('test', 'test')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
