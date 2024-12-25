import { IsNotEmpty, IsString } from 'class-validator';

export class LoginGoogleRequestDto {
  @IsNotEmpty()
  @IsString()
  token!: string;
}
