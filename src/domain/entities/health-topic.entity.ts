import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { HealthTopicHabit } from './health-topic-habit.entity';

@Entity()
export class HealthTopic extends BaseEntity {
  constructor(partial: Partial<HealthTopic>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'varchar', length: 64, default: null })
  icon?: string;

  @Column({ type: 'varchar', length: 300, default: null })
  description?: string;

  @OneToMany(() => HealthTopicHabit, (habit) => habit.topic, { cascade: true })
  habits!: HealthTopicHabit[];
}
