import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SingInDto } from './dto';
import { AuthPayload } from '../models/auth_payload.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  singIn(@Body() data: SingInDto): Promise<AuthPayload> {
    return this.authService.singIn(data.username, data.password);
  }
}
