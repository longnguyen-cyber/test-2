import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Nullable } from '../../common/constant';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { HealthTopicHabit } from './health-topic-habit.entity';

@Entity()
export class UserHabit extends BaseEntity {
  constructor(partial: Partial<UserHabit>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ type: 'varchar', length: 36 })
  habitId!: string;

  @Column({ type: 'varchar', length: 36 })
  consumerId!: string;

  @Column({ type: 'datetime', nullable: true })
  startDate?: Nullable<Date>;

  @Column({ type: 'datetime', nullable: true })
  endDate?: Nullable<Date>;

  @ManyToOne(() => HealthTopicHabit)
  @JoinColumn({})
  habit!: HealthTopicHabit;
}
