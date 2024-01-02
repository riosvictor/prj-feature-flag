import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FeatureFlagStateEnum } from '../../models/feature_flag.enum';

export class CreateFeatureFlagDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(FeatureFlagStateEnum)
  state?: FeatureFlagStateEnum;
}
