import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { TopicListResDto } from '../dto';
import { HealthTopic } from '../../../domain/entities';

export class GetTopicListQuery {}

@QueryHandler(GetTopicListQuery)
export class GetTopicListQueryHandler implements IQueryHandler<GetTopicListQuery> {
  constructor(private readonly dataSource: DataSource) {}

  async execute(): Promise<TopicListResDto> {
    const topics = await this.dataSource
      .createQueryBuilder(HealthTopic, 'topic')
      .leftJoinAndSelect('topic.habits', 'habit')
      .where('topic.isDeleted = false')
      .getMany();

    return plainToInstance(TopicListResDto, {
      data: topics,
    });
  }
}
