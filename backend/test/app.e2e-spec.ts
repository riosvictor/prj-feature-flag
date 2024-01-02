import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { FeatureFlagStateEnum } from '../src/models/feature_flag.enum';
import { usersFromDB } from '../mocks/fixtures';

describe('App (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await prisma.featureFlag.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('list empty, create flag, list one, list by id, update flag', async () => {
    // list empty
    const { body: bodyEmpty } = await request(app.getHttpServer()).get(
      '/feature_flags',
    );
    expect(bodyEmpty).toEqual([]);

    // create flag
    const { body: bodyCreate } = await request(app.getHttpServer())
      .post('/feature_flags')
      .send({
        name: 'batata',
        description: 'batata doce',
        state: FeatureFlagStateEnum.OFF,
      });
    expect(bodyCreate).toEqual({
      id: expect.any(String),
      name: 'batata',
      description: 'batata doce',
      state: FeatureFlagStateEnum.OFF,
    });

    // list one
    const { body: bodyListOne } = await request(app.getHttpServer()).get(
      '/feature_flags',
    );
    expect(bodyListOne.length).toEqual(1);

    // list by id
    const { body: bodyListById } = await request(app.getHttpServer()).get(
      `/feature_flags/${bodyCreate.id}`,
    );
    expect(bodyListById).toEqual(bodyCreate);

    // update flag
    const { body: bodyUpdate } = await request(app.getHttpServer())
      .patch(`/feature_flags/${bodyCreate.id}`)
      .send({
        state: FeatureFlagStateEnum.ON,
      });
    expect(bodyUpdate).toEqual(
      expect.objectContaining({
        state: FeatureFlagStateEnum.ON,
      }),
    );
  });

  it('create flag, delete, list empty, not found by id, not found to update', async () => {
    // create flag
    const { body: bodyCreate } = await request(app.getHttpServer())
      .post('/feature_flags')
      .send({
        name: 'batata',
        description: 'batata doce',
        state: FeatureFlagStateEnum.OFF,
      });
    expect(bodyCreate).toEqual({
      id: expect.any(String),
      name: 'batata',
      description: 'batata doce',
      state: FeatureFlagStateEnum.OFF,
    });

    // delete
    await request(app.getHttpServer()).delete(
      `/feature_flags/${bodyCreate.id}`,
    );

    // list empty
    const { body: bodyEmpty } = await request(app.getHttpServer()).get(
      '/feature_flags',
    );
    expect(bodyEmpty).toEqual([]);

    // not found by id
    const { body: bodyNotFoundById } = await request(app.getHttpServer()).get(
      `/feature_flags/${bodyCreate.id}`,
    );
    expect(bodyNotFoundById).toEqual({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Feature flag not found',
      error: 'Not Found',
    });

    // not found to update
    const { body: bodyNotFoundToUpdate } = await request(app.getHttpServer())
      .patch(`/feature_flags/${bodyCreate.id}`)
      .send({
        state: FeatureFlagStateEnum.ON,
      });
    expect(bodyNotFoundToUpdate).toEqual({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Feature flag not found',
      error: 'Not Found',
    });
  });

  it('create flag, error to create with same name, create another, erro to update to exists name', async () => {
    // create flag
    const { body: bodyCreate } = await request(app.getHttpServer())
      .post('/feature_flags')
      .send({
        name: 'batata',
        description: 'batata doce',
        state: FeatureFlagStateEnum.OFF,
      });
    expect(bodyCreate).toEqual({
      id: expect.any(String),
      name: 'batata',
      description: 'batata doce',
      state: FeatureFlagStateEnum.OFF,
    });

    // error to create with same name
    const { body: bodyErrorCreate } = await request(app.getHttpServer())
      .post('/feature_flags')
      .send({
        name: 'batata',
        description: 'batata doce',
        state: FeatureFlagStateEnum.OFF,
      });
    expect(bodyErrorCreate).toEqual({
      statusCode: HttpStatus.CONFLICT,
      message: 'Feature flag name already exists',
      error: 'Conflict',
    });

    // create another feature flag
    const { body: bodyCreateAnother } = await request(app.getHttpServer())
      .post('/feature_flags')
      .send({
        name: 'sorvete',
        description: 'sorvete gelado',
        state: FeatureFlagStateEnum.ON,
      });
    expect(bodyCreateAnother).toEqual({
      id: expect.any(String),
      name: 'sorvete',
      description: 'sorvete gelado',
      state: FeatureFlagStateEnum.ON,
    });

    // error to update second flag to existing unique name
    const { body: bodyErrorUpdate } = await request(app.getHttpServer())
      .patch(`/feature_flags/${bodyCreateAnother.id}`)
      .send({
        name: 'batata',
      });
    expect(bodyErrorUpdate).toEqual({
      statusCode: HttpStatus.CONFLICT,
      message: 'Feature flag name already exists',
      error: 'Conflict',
    });
  });

  it('create flag, error to try get state by name, login, get state by name and token', async () => {
    // create flag
    const { body: bodyCreate } = await request(app.getHttpServer())
      .post('/feature_flags')
      .send({
        name: 'batata',
        description: 'batata doce',
        state: FeatureFlagStateEnum.OFF,
      });
    expect(bodyCreate).toEqual({
      id: expect.any(String),
      name: 'batata',
      description: 'batata doce',
      state: FeatureFlagStateEnum.OFF,
    });

    // error to try get state by name
    const { body: bodyErrorGetStateByName } = await request(app.getHttpServer())
      .get(`/feature_flags/state/batata`)
      .send();
    expect(bodyErrorGetStateByName).toEqual({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Invalid authorization type',
      error: 'Unauthorized',
    });

    // login
    const existsUser = usersFromDB[0];
    const { body: bodyLogin } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: existsUser.username,
        password: existsUser.password,
      });
    expect(bodyLogin).toEqual(
      expect.objectContaining({
        access_token: expect.any(String),
      }),
    );

    // get state by name and token
    const { body: bodyGetStateByName } = await request(app.getHttpServer())
      .get(`/feature_flags/state/batata`)
      .set({
        Authorization: `Bearer ${bodyLogin.access_token}`,
      })
      .send();
    expect(bodyGetStateByName).toEqual({
      state: FeatureFlagStateEnum.OFF,
    });
  });
});
