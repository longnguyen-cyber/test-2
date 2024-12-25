import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MiningResDto {
  @Expose()
  startDate!: number;
  @Expose()
  endDate!: number;
  @Expose()
  point!: number;

  @Expose()
  boost!: number;
  @Expose()
  deviceId!: string;

  @Expose()
  isClaimed!: boolean;
  @Expose()
  isDone!: boolean;
}
