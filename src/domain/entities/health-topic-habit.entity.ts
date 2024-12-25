import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { HealthTopic } from './health-topic.entity';
import { HealthTopicHabitTask } from './health-topic-habit-task.entity';
import { UserHabit } from './user-habit.entity';

@Entity()
export class HealthTopicHabit extends BaseEntity {
  constructor(partial: Partial<HealthTopicHabit>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'varchar', length: 64, default: null })
  icon?: string;

  @Column({ type: 'varchar', length: 300, default: null })
  description?: string;

  @Column({ type: 'int' })
  days!: number;

  @Column('decimal', { precision: 5, scale: 2 })
  point!: number;

  @Column('decimal', { precision: 3, scale: 1 })
  rating?: number;

  @Column({ type: 'varchar', length: 36 })
  topicId!: string;

  @ManyToOne(() => HealthTopic, (topic) => topic.habits)
  topic!: HealthTopic;

  @OneToMany(() => HealthTopicHabitTask, (task) => task.habit, { cascade: true })
  tasks!: HealthTopicHabitTask[];

  @OneToMany(() => UserHabit, (userHabit) => userHabit.habit)
  userHabits!: UserHabit[];
}
