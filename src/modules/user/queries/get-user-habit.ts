import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { UserHabitListResDto } from '../dto';
import { HealthTopicHabitTaskHistory, UserHabit } from '../../../domain/entities';
import { LangCode, OrderBy } from '../../../common/constant';
import { TaskService } from 'src/modules/task/task.service';
import { TranslationService } from 'src/modules/translation/translation.service';

export class GetUserHabitQuery {
  constructor(public readonly consumerId: string, public readonly langCode: LangCode) {}
}

@QueryHandler(GetUserHabitQuery)
export class GetUserHabitQueryHandler implements IQueryHandler<GetUserHabitQuery> {
  constructor(
    @InjectRepository(UserHabit)
    private readonly userHabitRepo: Repository<UserHabit>,

    private readonly taskService: TaskService,
    private readonly tranSlationService: TranslationService,
  ) {}

  async execute(input: GetUserHabitQuery): Promise<UserHabitListResDto> {
    const { consumerId, langCode } = input;

    const userHabits = await this.userHabitRepo
      .createQueryBuilder('userHabit')
      .leftJoinAndSelect('userHabit.habit', 'habit')
      .leftJoinAndSelect('habit.tasks', 'tasks')
      .leftJoinAndSelect(
        'tasks.histories',
        'history',
        'history.consumerId = :consumerId AND history.isFinished = :isFinished',
        {
          consumerId,
          isFinished: false,
        },
      )
      .where('userHabit.consumerId = :consumerId', { consumerId })
      .orderBy('userHabit.createdAt', OrderBy.ASC)
      .limit(5)
      .getMany();

    const habitIds = userHabits.map((habit) => habit.habit.id);
    const taskIds = userHabits.flatMap((habit) => habit.habit.tasks.map((task) => task.id));

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

    userHabits.forEach((userHabit) => {
      const translatedHabit = habitTranslations.get(userHabit.habit.id);
      if (translatedHabit) {
        const [translatedHabitName, translatedHabitDescription] = translatedHabit.split('_');

        userHabit.habit.name = translatedHabitName;
        userHabit.habit.description = translatedHabitDescription;
      }

      userHabit.habit.tasks.forEach((task) => {
        const translatedTaskName = taskTranslations.get(task.id);
        if (translatedTaskName) {
          task.name = translatedTaskName;
        }
      });
    });

    await Promise.all(
      userHabits.map(async (habit) => {
        await Promise.all(
          habit.habit.tasks.map(async (task) => {
            const history = await this.taskService.getTaskHistory(consumerId, task.id);
            if (history) {
              task.histories = [history];
            }
          }),
        );
      }),
    );

    return plainToInstance(UserHabitListResDto, {
      today: dayjs().toDate(),
      data: userHabits.map((habit) => ({
        ...habit,
        habit: {
          ...habit.habit,
          tasks: habit.habit.tasks.map((task) => ({
            ...task,
            isFinished: task.histories.length > 0,
          })),
        },
      })),
    });
  }
}
