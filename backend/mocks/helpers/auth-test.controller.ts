import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../src/auth/auth.guard';

@Controller('auth-test')
export class AuthTestController {
  @Get('public')
  testPublic(): string {
    return 'OK';
  }

  @UseGuards(AuthGuard)
  @Get('auth')
  testAuth(): string {
    return 'OK';
  }
}
