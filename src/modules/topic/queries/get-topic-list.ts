import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { LangCode } from 'src/common/constant';
import { TranslationService } from 'src/modules/translation/translation.service';
import { DataSource } from 'typeorm';
import { HealthTopic, Translation } from '../../../domain/entities';
import { TopicListResDto } from '../dto';

export class GetTopicListQuery {
  constructor(public readonly langCode: LangCode) {}
}

@QueryHandler(GetTopicListQuery)
export class GetTopicListQueryHandler implements IQueryHandler<GetTopicListQuery> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly tranSlationService: TranslationService,
  ) {}

  async execute(input: GetTopicListQuery): Promise<TopicListResDto> {
    const langCode = input.langCode;
    const topics = await this.dataSource
      .createQueryBuilder(HealthTopic, 'topic')
      .leftJoinAndSelect('topic.habits', 'habit')
      .leftJoinAndSelect('habit.tasks', 'task')
      .where('topic.isDeleted = false')
      .getMany();
    const topicIds = topics.map((topic) => topic.id);
    const habitIds = topics.flatMap((topic) => topic.habits.map((habit) => habit.id));
    const taskIds = topics.flatMap((topic) =>
      topic.habits.flatMap((habit) => habit.tasks.map((task) => task.id)),
    );

    const topicTranslations = await this.tranSlationService.getTranstalion(
      langCode,
      topicIds,
      'health_topics',
    );

    const habitTranslations = await this.tranSlationService.getTranstalion(
      langCode,
      habitIds,
      'health_topic_habits',
    );

    const taskTranslations = await this.tranSlationService.getTranstalion(
      langCode,
      taskIds,
      'health_topic_habit_tasks',
    );

    topics.forEach((topic) => {
      const translatedTopicName = topicTranslations.get(topic.id);
      if (translatedTopicName) {
        topic.name = translatedTopicName;
      }

      topic.habits.forEach((habit) => {
        const translatedHabit = habitTranslations.get(habit.id);

        if (translatedHabit) {
          const [translatedHabitName, translatedHabitDescription] = translatedHabit.split('_');
          habit.name = translatedHabitName;
          habit.description = translatedHabitDescription;
        }

        habit.tasks.forEach((task) => {
          const translatedTaskName = taskTranslations.get(task.id);
          if (translatedTaskName) {
            task.name = translatedTaskName;
          }
        });
      });
    });

    return plainToInstance(TopicListResDto, {
      data: topics,
    });
  }
}
