import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { HealthTopicHabit } from './health-topic-habit.entity';
import { HealthTopicHabitTaskHistory } from './health-topic-habit-task-history.entity';

@Entity()
export class HealthTopicHabitTask extends BaseEntity {
  constructor(partial: Partial<HealthTopicHabitTask>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'varchar', length: 64, default: null })
  icon?: string;

  @Column({ type: 'varchar', length: 300, default: null })
  description?: string;

  @Column('decimal', { precision: 5, scale: 2, default: 0.2 })
  point!: number;

  @Column({ type: 'varchar', length: 36 })
  habitId!: string;

  @ManyToOne(() => HealthTopicHabit, (habit) => habit.tasks)
  habit!: HealthTopicHabit;

  @OneToMany(() => HealthTopicHabitTaskHistory, (history) => history.tasks)
  histories!: HealthTopicHabitTaskHistory[];
}
