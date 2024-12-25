import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class ReferralInfoDto {
  @Expose()
  @Type(() => Number)
  totalInvited!: number;

  @Expose()
  @Type(() => Number)
  totalValid!: number;

  @Expose()
  @Type(() => Number)
  totalEarned!: number;
}
