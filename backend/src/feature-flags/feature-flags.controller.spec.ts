import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { FeatureFlagsController } from './feature-flags.controller';
import { FeatureFlagsService } from './feature-flags.service';
import { PrismaService } from '../infra/prisma/prisma.service';
import { responseAllFeatureFlags } from '../../mocks/fixtures';
import { CreateFeatureFlagSchemaHelper } from '../../mocks/helpers/create-feature-flag.dto';
import { UpdateFeatureFlagSchemaHelper } from '../../mocks/helpers/update-feature-flag.dto';

describe('FeatureFlagsController', () => {
  let app: INestApplication;
  let featureFlagsService: FeatureFlagsService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'secret' })],
      controllers: [FeatureFlagsController],
      providers: [FeatureFlagsService, PrismaService],
    }).compile();

    featureFlagsService = module.get<FeatureFlagsService>(FeatureFlagsService);
    jwtService = module.get<JwtService>(JwtService);

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should return all flags', async () => {
    jest
      .spyOn(featureFlagsService, 'get')
      .mockResolvedValueOnce(responseAllFeatureFlags);

    const { body, statusCode } = await request(app.getHttpServer()).get(
      `/feature_flags`,
    );

    expect(featureFlagsService.get).toHaveBeenCalledWith({
      skip: undefined,
      take: undefined,
    });
    expect(body).toEqual(responseAllFeatureFlags);
    expect(body.length).toBe(responseAllFeatureFlags.length);
    expect(statusCode).toEqual(HttpStatus.OK);
  });

  it('should return one flag by id', async () => {
    const firstItem = responseAllFeatureFlags[0];

    jest.spyOn(featureFlagsService, 'getOne').mockResolvedValueOnce(firstItem);

    const { body, statusCode } = await request(app.getHttpServer()).get(
      `/feature_flags/${firstItem.id}`,
    );

    expect(featureFlagsService.getOne).toHaveBeenCalledWith({
      id: firstItem.id,
    });
    expect(body).toEqual(firstItem);
    expect(statusCode).toEqual(HttpStatus.OK);
  });

  it('should create a flag', async () => {
    const newFlag = CreateFeatureFlagSchemaHelper.createPlain();

    jest.spyOn(featureFlagsService, 'create').mockResolvedValueOnce(newFlag);

    const { body, statusCode } = await request(app.getHttpServer())
      .post(`/feature_flags`)
      .send(newFlag);

    expect(featureFlagsService.create).toHaveBeenCalledWith(newFlag);
    expect(body).toEqual(newFlag);
    expect(statusCode).toEqual(HttpStatus.CREATED);
  });

  it('should update a flag', async () => {
    const id = crypto.randomUUID();
    const existsFlag = CreateFeatureFlagSchemaHelper.createPlain();
    const changesFlag = UpdateFeatureFlagSchemaHelper.createPlain();
    const changedFlag = { id, ...existsFlag, ...changesFlag };

    jest
      .spyOn(featureFlagsService, 'update')
      .mockResolvedValueOnce(changedFlag);

    const { body, statusCode } = await request(app.getHttpServer())
      .patch(`/feature_flags/${id}`)
      .send(changesFlag);

    expect(featureFlagsService.update).toHaveBeenCalledWith({
      where: { id },
      data: changesFlag,
    });
    expect(body).toEqual(changedFlag);
    expect(statusCode).toEqual(HttpStatus.OK);
  });

  it('should delete one flag', async () => {
    jest.spyOn(featureFlagsService, 'delete').mockResolvedValueOnce({} as any);

    const id = crypto.randomUUID();
    const { body, statusCode } = await request(app.getHttpServer()).delete(
      `/feature_flags/${id}`,
    );

    expect(featureFlagsService.delete).toHaveBeenCalledWith({ id });
    expect(body).toEqual({});
    expect(statusCode).toEqual(HttpStatus.NO_CONTENT);
  });

  it('should return one flag by name', async () => {
    const payload = {
      sub: 1,
      username: 'test',
    };
    const signedToken = jwtService.sign(payload, { expiresIn: 60 });
    const authorization = `Bearer ${signedToken}`;
    const headers = {
      Authorization: authorization,
    };
    const firstItem = responseAllFeatureFlags[0];
    const response = { state: firstItem.state };

    jest.spyOn(featureFlagsService, 'getOne').mockResolvedValueOnce(firstItem);
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce(payload);

    const { body, statusCode } = await request(app.getHttpServer())
      .get(`/feature_flags/state/${firstItem.name}`)
      .set(headers);

    expect(featureFlagsService.getOne).toHaveBeenCalledWith({
      name: firstItem.name,
    });
    expect(body).toEqual(response);
    expect(statusCode).toEqual(HttpStatus.OK);
  });

  it('should throws an unauthorized error when try get one flag by name', async () => {
    const firstItem = responseAllFeatureFlags[0];

    jest.spyOn(featureFlagsService, 'getOne').mockResolvedValueOnce(firstItem);

    const { body } = await request(app.getHttpServer()).get(
      `/feature_flags/state/${firstItem.name}`,
    );

    expect(featureFlagsService.getOne).not.toHaveBeenCalled();
    expect(body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid authorization type',
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  });
});
