import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { HealthTopicHabitTask } from './health-topic-habit-task.entity';

@Entity()
export class HealthTopicHabitTaskHistory extends BaseEntity {
  constructor(partial: Partial<HealthTopicHabitTaskHistory>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ type: 'varchar', length: 36 })
  consumerId!: string;

  @Column({ type: 'boolean', default: false })
  isFinished!: boolean;

  @Column('decimal', { precision: 5, scale: 2, default: 0.2 })
  point!: number;

  @Column({ type: 'varchar', length: 36 })
  taskId!: string;

  @ManyToOne(() => HealthTopicHabitTask, (task) => task.histories)
  tasks!: HealthTopicHabitTask[];
}
