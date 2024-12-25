import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class VersionResDto {
  @Expose()
  version!: string;

  @Expose()
  url!: string;

  @Expose()
  platform!: string;
}
