import { LangCode } from '../../common/constant/lang-code';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class Translation extends BaseEntity {
  constructor(partial: Partial<Translation>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ type: 'varchar', length: 255 })
  table_name!: string;

  @Column({ type: 'varchar', length: 36 })
  record_id!: string;

  @Column({ type: 'enum', enum: LangCode, default: LangCode.VI })
  language_code!: LangCode;

  @Column({ type: 'text' })
  translation!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
