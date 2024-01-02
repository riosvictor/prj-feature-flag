import { plainToInstance } from 'class-transformer';
import { CreateFeatureFlagDto } from '../../src/feature-flags/dto';

export class CreateFeatureFlagSchemaHelper {
  static createPlain(): any {
    return {
      name: 'feature_test',
      description: 'feature test description',
      state: 'OFF',
    };
  }

  static createClass(): CreateFeatureFlagDto {
    return plainToInstance(
      CreateFeatureFlagDto,
      CreateFeatureFlagSchemaHelper.createPlain(),
    );
  }
}
