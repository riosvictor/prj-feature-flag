import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { responseAllFeatureFlags } from '../../mocks/fixtures';
import { PrismaService } from '../infra/prisma/prisma.service';
import { FeatureFlagsService } from './feature-flags.service';
import { UpdateFeatureFlagSchemaHelper } from '../../mocks/helpers/update-feature-flag.dto';
import { PrismaModule } from '../infra/prisma/prisma.module';

describe('FeatureFlagsService', () => {
  let service: FeatureFlagsService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'secret' }), PrismaModule],
      providers: [FeatureFlagsService],
    }).compile();

    service = module.get<FeatureFlagsService>(FeatureFlagsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return an flags list', async () => {
    jest
      .spyOn(prismaService.featureFlag, 'findMany')
      .mockResolvedValueOnce(responseAllFeatureFlags);

    const result = await service.get({});

    expect(result).toEqual(responseAllFeatureFlags);
  });

  it('should return an empty flags list', async () => {
    jest.spyOn(prismaService.featureFlag, 'findMany').mockResolvedValueOnce([]);

    const result = await service.get({});

    expect(result).toEqual([]);
  });

  it('should return one flag by id', async () => {
    const flagItem = responseAllFeatureFlags[0];
    jest
      .spyOn(prismaService.featureFlag, 'findUnique')
      .mockResolvedValueOnce(flagItem);

    const result = await service.getOne({ id: flagItem.id });

    expect(result).toEqual(flagItem);
  });

  it('should not found one flag by id', async () => {
    jest
      .spyOn(prismaService.featureFlag, 'findUnique')
      .mockResolvedValueOnce(null);

    await expect(service.getOne({ id: 'test' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return one flag by name', async () => {
    const flagItem = responseAllFeatureFlags[0];
    jest
      .spyOn(prismaService.featureFlag, 'findUnique')
      .mockResolvedValueOnce(flagItem);

    const result = await service.getOne({ name: flagItem.name });

    expect(result).toEqual(flagItem);
  });

  it('should not found one flag by name', async () => {
    jest
      .spyOn(prismaService.featureFlag, 'findUnique')
      .mockResolvedValueOnce(null);

    await expect(service.getOne({ name: 'test' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return new created flag', async () => {
    const flagItem = responseAllFeatureFlags[0];
    jest
      .spyOn(prismaService.featureFlag, 'findUnique')
      .mockResolvedValueOnce(null);
    jest
      .spyOn(prismaService.featureFlag, 'create')
      .mockResolvedValueOnce(flagItem);

    const result = await service.create(flagItem);

    expect(result).toEqual(flagItem);
  });

  it('should throws an error because name flag already exists when try create flag', async () => {
    const flagItem = responseAllFeatureFlags[0];
    jest
      .spyOn(prismaService.featureFlag, 'findUnique')
      .mockResolvedValueOnce(flagItem);

    await expect(service.create(flagItem)).rejects.toThrow(ConflictException);
  });

  it('should return updated flag', async () => {
    const flagItem = responseAllFeatureFlags[0];
    const flagChanges = UpdateFeatureFlagSchemaHelper.createPlain();
    const flagUpdated = { ...flagItem, ...flagChanges };
    jest
      .spyOn(prismaService.featureFlag, 'findUnique')
      // exists this flag by id?
      .mockResolvedValueOnce(flagItem)
      // exists flag with the same unique name?
      .mockResolvedValueOnce(null);
    jest
      .spyOn(prismaService.featureFlag, 'update')
      .mockResolvedValueOnce(flagUpdated);

    const result = await service.update({
      where: { id: flagItem.id },
      data: flagChanges,
    });

    expect(result).toEqual(flagUpdated);
  });

  it('should throws an error because flag not found when try update flag', async () => {
    const flagItem = responseAllFeatureFlags[0];
    const flagChanges = UpdateFeatureFlagSchemaHelper.createPlain();
    jest
      .spyOn(prismaService.featureFlag, 'findUnique')
      // exists this flag by id?
      .mockResolvedValueOnce(null);

    await expect(
      service.update({
        where: { id: flagItem.id },
        data: flagChanges,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throws an error because flag name already exists when try update flag', async () => {
    const flagItem = responseAllFeatureFlags[0];
    const flagChanges = UpdateFeatureFlagSchemaHelper.createPlain();
    jest
      .spyOn(prismaService.featureFlag, 'findUnique')
      // exists this flag by id?
      .mockResolvedValueOnce(flagItem)
      // exists flag with the same unique name?
      .mockResolvedValueOnce(flagItem);

    await expect(
      service.update({
        where: { id: flagItem.id },
        data: flagChanges,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should delete flag', async () => {
    const flagItem = responseAllFeatureFlags[0];
    jest
      .spyOn(prismaService.featureFlag, 'findUnique')
      .mockResolvedValueOnce(flagItem);

    jest
      .spyOn(prismaService.featureFlag, 'delete')
      .mockResolvedValueOnce(flagItem);

    const result = await service.delete({ id: flagItem.id });

    expect(result).toEqual(flagItem);
  });

  it('should throws an error because flag not found when try update flag', async () => {
    const flagItem = responseAllFeatureFlags[0];
    jest
      .spyOn(prismaService.featureFlag, 'findUnique')
      .mockResolvedValueOnce(null);

    await expect(service.delete({ id: flagItem.id })).rejects.toThrow(
      NotFoundException,
    );
  });
});
