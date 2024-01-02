import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FeatureFlag, Prisma } from '@prisma/client';
import { PrismaService } from '../infra/prisma/prisma.service';

@Injectable()
export class FeatureFlagsService {
  constructor(private prisma: PrismaService) {}

  async getOne(
    where: Prisma.FeatureFlagWhereUniqueInput,
  ): Promise<FeatureFlag | null> {
    const flag = await this.prisma.featureFlag.findUnique({
      where,
    });

    if (!flag) {
      throw this.featureFlagNotFound();
    }

    return flag;
  }

  async get(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.FeatureFlagWhereUniqueInput;
    where?: Prisma.FeatureFlagWhereInput;
  }): Promise<FeatureFlag[]> {
    const { skip, take, cursor, where } = params;
    return this.prisma.featureFlag.findMany({
      skip,
      take,
      cursor,
      where,
    });
  }

  async create(data: Prisma.FeatureFlagCreateInput): Promise<FeatureFlag> {
    const { name, description, state } = data;
    const exists = await this.verifyUniqueNameExists(name);

    if (exists) {
      throw this.featureFlagNameAlreadyExists();
    }

    return this.prisma.featureFlag.create({
      data: {
        name,
        description,
        state,
      },
    });
  }

  async update(params: {
    where: Prisma.FeatureFlagWhereUniqueInput;
    data: Prisma.FeatureFlagUpdateInput;
  }): Promise<FeatureFlag> {
    const { where } = params;
    const { name, description, state } = params.data;
    const flag = await this.getOne(where);

    if (name) {
      const exists = await this.verifyUniqueNameExists(String(name), flag.id);

      if (exists) {
        throw this.featureFlagNameAlreadyExists();
      }
    }

    return this.prisma.featureFlag.update({
      data: {
        name,
        description,
        state,
      },
      where,
    });
  }

  async delete(
    where: Prisma.FeatureFlagWhereUniqueInput,
  ): Promise<FeatureFlag> {
    await this.getOne(where);

    return this.prisma.featureFlag.delete({
      where,
    });
  }

  private featureFlagNotFound(): NotFoundException {
    return new NotFoundException('Feature flag not found');
  }

  private featureFlagNameAlreadyExists(): ConflictException {
    return new ConflictException('Feature flag name already exists');
  }

  private async verifyUniqueNameExists(
    name: string,
    id?: string,
  ): Promise<boolean> {
    let where: Prisma.FeatureFlagWhereUniqueInput = {
      name,
    };

    if (id) {
      // verify only others flags
      where = {
        ...where,
        NOT: {
          id,
        },
      };
    }

    const flag = await this.prisma.featureFlag.findUnique({
      where,
    });

    return !!flag;
  }
}
