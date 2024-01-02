import { PrismaClient, Prisma } from '@prisma/client';
import { FeatureFlagStateEnum } from '../src/models/feature_flag.enum';

const prisma = new PrismaClient();

const flagData: Prisma.FeatureFlagCreateInput[] = [
  {
    name: 'batata',
    description: 'batata doce',
    state: FeatureFlagStateEnum.OFF,
  },
  {
    name: 'sorvete',
    description: 'sorvete gelado',
    state: FeatureFlagStateEnum.ON,
  },
  {
    name: 'creme',
    description: 'creme de leite',
    state: FeatureFlagStateEnum.ON,
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const f of flagData) {
    const flag = await prisma.featureFlag.create({
      data: f,
    });
    console.log(`Created flag with id: ${flag.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
