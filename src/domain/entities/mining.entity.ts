import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MiningStatus } from '../../common/constant';
import { User } from './user.entity';

@Entity()
export class Mining extends BaseEntity {
  constructor(partial: Partial<Mining>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ type: 'varchar', length: 36 })
  consumerId!: string;

  @Column({ type: 'bigint' })
  startDate!: number;

  @Column({ type: 'bigint' })
  endDate!: number;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  point!: number;

  @Column({ type: 'enum', enum: MiningStatus, default: MiningStatus.PENDING })
  status!: MiningStatus;

  @Column({ type: 'boolean', default: false })
  isClaimed!: boolean;

  @Column({ type: 'int', default: 0 })
  boost!: number;

  @Column({ type: 'varchar', length: 36, nullable: true })
  deviceId!: string;
  @Column({ type: 'boolean', default: false })
  isDone!: boolean;

  @ManyToOne(() => User, (user) => user.minings)
  user!: User;
}
