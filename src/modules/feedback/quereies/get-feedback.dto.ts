import { QueryHandler } from '@nestjs/cqrs';
import { Feedback } from 'src/domain/entities/feedback.entity';
import { DataSource } from 'typeorm';

export class GetFeedbackQuery {
  constructor(public readonly feedbackId: string, public readonly consumerId: string) {}
}

@QueryHandler(GetFeedbackQuery)
export class GetFeedbackQueryHandler {
  constructor(private readonly dataSource: DataSource) {}

  async execute(input: GetFeedbackQuery) {
    const { feedbackId, consumerId } = input;

    return await this.dataSource
      .createQueryBuilder(Feedback, 'feedback')
      .where('feedback.id = :feedbackId', { feedbackId })
      .andWhere('feedback.consumerId = :consumerId', { consumerId })
      .andWhere('feedback.isDeleted = false')
      .select([
        'feedback.id',
        'feedback.name',
        'feedback.content',
        'feedback.status',
        'feedback.createdAt',
        'feedback.updatedAt',
      ])
      .getOne();
  }
}
