import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Platform } from 'src/common/constant/platform.enum';

@Entity()
export class Version extends BaseEntity {
  constructor(partial: Partial<Version>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ type: 'varchar', length: 36 })
  version!: string;

  @Column({ type: 'enum', enum: Platform })
  platform!: Platform;

  @Column({ type: 'varchar', length: 300 })
  url!: string;
}
