import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from '../models/auth_payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async singIn(username: string, pass: string): Promise<AuthPayload> {
    const user = await this.usersService.findOne(username);

    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      username: user.username,
    };

    return {
      access_token: await this.generateToken(payload),
    };
  }

  private generateToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
