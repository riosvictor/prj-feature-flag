import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FeatureFlagStateEnum } from '../../models/feature_flag.enum';

export class UpdateFeatureFlagDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(FeatureFlagStateEnum)
  state?: FeatureFlagStateEnum;
}
