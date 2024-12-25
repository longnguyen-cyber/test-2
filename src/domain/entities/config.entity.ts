import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class Config extends BaseEntity {
  constructor(partial: Partial<Config>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ type: 'varchar', length: 64 })
  name!: string;

  @Column({ type: 'varchar', length: 160 })
  value!: string;

  @Column({ type: 'varchar', length: 200 })
  description?: string;
}
