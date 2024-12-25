import { QueryHandler } from '@nestjs/cqrs';
import { Feedback } from 'src/domain/entities/feedback.entity';
import { DataSource } from 'typeorm';

export class GetFeedbacksQuery {
  constructor(public readonly consumerId: string) {}
}

@QueryHandler(GetFeedbacksQuery)
export class GetFeedbacksQueryHandler {
  constructor(private readonly dataSource: DataSource) {}

  async execute(input: GetFeedbacksQuery) {
    const { consumerId } = input;

    try {
      return await this.dataSource
        .createQueryBuilder(Feedback, 'feedback')
        .where('feedback.consumerId = :consumerId', { consumerId })
        .andWhere('feedback.isDeleted = false')
        .select([
          'feedback.id',
          'feedback.name',
          'feedback.content',
          'feedback.status',
          'feedback.createdAt',
          'feedback.updatedAt',
        ])
        .getMany();
    } catch (error) {
      throw new Error('Method not implemented.');
    }
  }
}
