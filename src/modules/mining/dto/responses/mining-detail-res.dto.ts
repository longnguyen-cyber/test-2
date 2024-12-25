import { Exclude, Expose, Type } from 'class-transformer';
import { Nullable } from 'src/common/constant';

@Exclude()
export class MiningDetailResDto {
  @Expose()
  startDate!: Nullable<Date>;

  @Expose()
  endDate!: Nullable<Date>;

  @Expose()
  @Type(() => Number)
  point!: number;

  @Expose()
  @Type(() => Number)
  level!: number;

  @Expose()
  boost!: number;

  @Expose()
  @Type(() => Number)
  totalInvite!: number;

  @Expose()
  @Type(() => Number)
  totalPoolMined!: number;
}
