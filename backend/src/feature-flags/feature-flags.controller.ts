import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Query,
  Patch,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FeatureFlag as FeatureFlagModel } from '@prisma/client';
import { FeatureFlagsService } from './feature-flags.service';
import { CreateFeatureFlagDto, UpdateFeatureFlagDto } from './dto';
import { AuthGuard } from '../auth/auth.guard';
import { ParseOptionalIntPipe } from '../pipes/parse-optional-int-pipe.pipe';

@Controller('feature_flags')
export class FeatureFlagsController {
  constructor(private readonly featureFlagService: FeatureFlagsService) {}

  @Get()
  async getAllFlags(
    @Query('take', ParseOptionalIntPipe) take?: number,
    @Query('skip', ParseOptionalIntPipe) skip?: number,
  ): Promise<FeatureFlagModel[]> {
    return this.featureFlagService.get({
      take,
      skip,
    });
  }

  @Get(':id')
  async getFlagById(@Param('id') id: string): Promise<FeatureFlagModel> {
    return this.featureFlagService.getOne({
      id,
    });
  }

  @Post()
  async createFlag(
    @Body()
    data: CreateFeatureFlagDto,
  ): Promise<FeatureFlagModel> {
    return this.featureFlagService.create(data);
  }

  @Patch(':id')
  async updateFlag(
    @Param('id') id: string,
    @Body()
    data: UpdateFeatureFlagDto,
  ): Promise<FeatureFlagModel> {
    return this.featureFlagService.update({ where: { id }, data });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFlag(@Param('id') id: string): Promise<void> {
    await this.featureFlagService.delete({ id });
  }

  @UseGuards(AuthGuard)
  @Get('state/:name')
  async getFlagStateByName(
    @Param('name') name: string,
  ): Promise<Partial<FeatureFlagModel>> {
    const { state } = await this.featureFlagService.getOne({
      name,
    });

    return { state };
  }
}
