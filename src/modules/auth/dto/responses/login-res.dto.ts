import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class LoginResDto {
  @Expose()
  accessToken!: string;

  @Expose()
  userId!: string;

  @Expose()
  @Type(() => Boolean)
  isNewUser!: boolean;
}
