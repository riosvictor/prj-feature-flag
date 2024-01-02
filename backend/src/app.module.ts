import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FeatureFlagsModule } from './feature-flags/feature-flags.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './infra/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FeatureFlagsModule,
    AuthModule,
    UsersModule,
    PrismaModule,
  ],
})
export class AppModule {}
