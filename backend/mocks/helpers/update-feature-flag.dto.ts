import { plainToInstance } from 'class-transformer';
import { UpdateFeatureFlagDto } from '../../src/feature-flags/dto';

export class UpdateFeatureFlagSchemaHelper {
  static createPlain(): any {
    return {
      name: 'feature_test',
      state: 'OFF',
    };
  }

  static createClass(): UpdateFeatureFlagDto {
    return plainToInstance(
      UpdateFeatureFlagDto,
      UpdateFeatureFlagSchemaHelper.createPlain(),
    );
  }
}
