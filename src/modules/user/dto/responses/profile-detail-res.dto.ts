import { Exclude, Expose, Type } from 'class-transformer';
import { Gender, Nullable } from 'src/common/constant';

@Exclude()
export class ProfileDetailResDto {
  @Expose()
  email!: string;

  @Expose()
  name!: string;

  @Expose()
  phone?: string;

  @Expose()
  avatar?: string;

  @Expose()
  wallet!: string;

  @Expose()
  refererCode?: string;

  @Expose()
  @Type(() => Number)
  point!: number;

  @Expose()
  @Type(() => Number)
  exp!: number;

  @Expose()
  @Type(() => Number)
  level!: number;

  @Expose()
  gender!: Nullable<Gender>;

  @Expose()
  @Type(() => Number)
  old!: number;

  @Expose()
  @Type(() => Number)
  height!: number;

  @Expose()
  @Type(() => Number)
  weight!: number;

  @Expose()
  miningEarned!: number;
}
