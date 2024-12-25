import { FeedbackStatus } from 'src/common/constant/feedbact.status';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()

// (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`consumerId\` varchar(36) NOT NULL, \`content\` varchar(300) NOT NULL, \`name\` varchar(300) NOT NULL, \`status\` enum ('pending', 'approved', 'rejected')
export class Feedback extends BaseEntity {
  constructor(partial: Partial<Feedback>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ type: 'varchar', length: 36 })
  consumerId!: string;

  @Column({ type: 'varchar', length: 300 })
  content!: string;

  @Column({ type: 'varchar', length: 300 })
  name!: string;

  @Column({ type: 'enum', enum: FeedbackStatus, default: FeedbackStatus.PENDING })
  status!: FeedbackStatus;
}
