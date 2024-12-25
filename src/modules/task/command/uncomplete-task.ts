import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { SeimBadRequestException } from '../../../common/exception';
import { HealthTopicHabitTaskHistory } from '../../../domain/entities';
import { UserService } from '../../user/user.service';

export class UnCompleteTaskCommand {
  constructor(public readonly consumerId: string, public readonly taskId: string) {}
}

@CommandHandler(UnCompleteTaskCommand)
export class UnCompleteTaskCommandHandler implements ICommandHandler<UnCompleteTaskCommand> {
  constructor(
    @InjectRepository(HealthTopicHabitTaskHistory)
    private readonly taskHistoryRepo: Repository<HealthTopicHabitTaskHistory>,
    private readonly userService: UserService,
  ) {}

  async execute(input: UnCompleteTaskCommand): Promise<any> {
    const { consumerId, taskId } = input;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
      const history = await this.taskHistoryRepo.find({
        where: {
          taskId: taskId,
          consumerId,
          isFinished: true,
          createdAt: Between(startOfDay, endOfDay),
        },
      });

      if (history.length === 0) throw new SeimBadRequestException('Task not found');

      await this.taskHistoryRepo.delete({
        id: history[0].id,
      });

      // Update user point
      const point = history[0].point;
      await this.userService.updateUserPoint(consumerId, -point);
      return { point: -point };
    } catch (error: any) {
      throw new SeimBadRequestException(error.message);
    }
  }
}
