import { Test, TestingModule } from '@nestjs/testing';
import { FeatureFlagsModule } from './feature-flags.module';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../infra/prisma/prisma.module';

describe('FeatureFlagsModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AuthModule, FeatureFlagsModule, PrismaModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
