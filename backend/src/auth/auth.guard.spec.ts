import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AuthTestController } from '../../mocks/helpers/auth-test.controller';

describe('AuthGuard', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'secret' })],
      controllers: [AuthTestController],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it(`should return ok on public undefined token`, async () => {
    return request(app.getHttpServer())
      .get(`/auth-test/public`)
      .then((response) => {
        expect(response.status).toEqual(HttpStatus.OK);
      });
  });

  it(`should return ok on auth valid token`, async () => {
    const payload = {
      sub: 1,
      username: 'test',
    };
    const signedToken = jwtService.sign(payload, { expiresIn: 60 });
    const authorization = `Bearer ${signedToken}`;
    const headers = {
      Authorization: authorization,
    };

    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce(payload);

    return request(app.getHttpServer())
      .get(`/auth-test/auth`)
      .set(headers)
      .then((response) => {
        expect(response.status).toEqual(HttpStatus.OK);
      });
  });

  it(`should throws an error because token type is not bearer`, async () => {
    const payload = {
      sub: 1,
      username: 'test',
    };
    const signedToken = jwtService.sign(payload, { expiresIn: 60 });
    const authorization = `${signedToken}`;
    const headers = {
      Authorization: authorization,
    };

    const { body } = await request(app.getHttpServer())
      .get(`/auth-test/auth`)
      .set(headers);

    expect(body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    expect(body.error).toEqual('Unauthorized');
    expect(body.message).toEqual('Invalid authorization type');
  });

  it(`should throws an error because credentials is missing`, async () => {
    const authorization = 'Bearer';
    const headers = {
      Authorization: authorization,
    };

    const { body } = await request(app.getHttpServer())
      .get(`/auth-test/auth`)
      .set(headers);

    expect(body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    expect(body.error).toEqual('Unauthorized');
    expect(body.message).toEqual('Token is not provided');
  });

  it(`should throws an error because none token provided`, async () => {
    const headers = {};

    const { body } = await request(app.getHttpServer())
      .get(`/auth-test/auth`)
      .set(headers);

    expect(body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    expect(body.error).toEqual('Unauthorized');
    expect(body.message).toEqual('Invalid authorization type');
  });

  it(`should throws an error because validation token throws`, async () => {
    const payload = {
      sub: 1,
      username: 'test',
    };
    const signedToken = jwtService.sign(payload, { expiresIn: 60 });
    const authorization = `Bearer ${signedToken}`;
    const headers = {
      Authorization: authorization,
    };

    jest.spyOn(jwtService, 'verifyAsync').mockRejectedValueOnce(new Error());

    const { body } = await request(app.getHttpServer())
      .get(`/auth-test/auth`)
      .set(headers);

    expect(body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    expect(body.error).toEqual('Unauthorized');
    expect(body.message).toEqual('Invalid token provided');
  });
});
