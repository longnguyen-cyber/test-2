import { CommandHandler, ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SeimBadRequestException } from '../../../common/exception';
import { HealthTopicHabitTaskHistory } from '../../../domain/entities';
import { UserService } from '../../user/user.service';
import { CompleteTaskRequestDto } from '../dto';

export class CompleteTaskCommand {
  constructor(public readonly consumerId: string, public readonly data: CompleteTaskRequestDto) {}
}

@CommandHandler(CompleteTaskCommand)
export class CompleteTaskCommandHandler implements ICommandHandler<CompleteTaskCommand> {
  constructor(
    @InjectRepository(HealthTopicHabitTaskHistory)
    private readonly taskHistoryRepo: Repository<HealthTopicHabitTaskHistory>,
    private readonly userService: UserService,
  ) {}

  async execute(input: CompleteTaskCommand): Promise<any> {
    const {
      consumerId,
      data: { taskId, habitId },
    } = input;

    try {
      const currentDate = new Date();
      const userHabit = await this.userService.getUserHabitWithTask(habitId, consumerId, taskId);

      if (!userHabit) throw new SeimBadRequestException('User habit not found');
      const pointOfTask = userHabit.habit.tasks.find((task) => task.id === taskId)?.point;
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const isTaskCompleted = await this.taskHistoryRepo.findOne({
        where: {
          consumerId,
          taskId,
          isFinished: true,
          createdAt: Between(startOfDay, endOfDay),
        },
      });

      if (isTaskCompleted) {
        throw new SeimBadRequestException('Task is already completed');
      }

      await this.taskHistoryRepo.insert({
        consumerId,
        taskId,
        isFinished: true,
        point: pointOfTask,
      });

      await this.userService.updateUserPoint(consumerId, pointOfTask || 0);

      return { point: pointOfTask };
    } catch (error: any) {
      throw new SeimBadRequestException(error.message);
    }
  }
}
