import { IsString } from 'class-validator';

export class SingInDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
