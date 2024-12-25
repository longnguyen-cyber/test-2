import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { SeimBadRequestException } from 'src/common/exception';
import { HealthTopicHabitTaskHistory } from 'src/domain/entities';
import { UserService } from 'src/modules/user/user.service';
import { Repository } from 'typeorm';

export class UploadTaskCommand {
  constructor(public readonly comsumerId: string, public readonly data: any) {}
}

@CommandHandler(UploadTaskCommand)
export class UploadTaskCommandHandler implements ICommandHandler<UploadTaskCommand> {
  constructor(
    @InjectRepository(HealthTopicHabitTaskHistory)
    private readonly taskHistoryRepo: Repository<HealthTopicHabitTaskHistory>,

    private readonly userService: UserService,
  ) {}

  async execute(input: UploadTaskCommand): Promise<any> {
    const { comsumerId, data } = input;

    try {
      let totalPoint = 0;
      for (const task of data) {
        const taskHistoryExist = await this.taskHistoryRepo.findOne({
          where: {
            consumerId: comsumerId,
            taskId: task.taskId,
          },
        });

        if (taskHistoryExist) {
          await this.taskHistoryRepo.update(
            {
              consumerId: comsumerId,
              taskId: task.taskId,
            },
            {
              isFinished: task.isFinished,
              point: Number(task.point),
            },
          );
        } else {
          totalPoint += Number(task.point);

          await this.taskHistoryRepo.insert({
            consumerId: comsumerId,
            taskId: task.taskId,
            isFinished: task.isFinished,
            point: Number(task.point),
          });
        }
      }

      await this.userService.updateUserPoint(comsumerId, totalPoint);
      return { point: totalPoint };
    } catch (error: any) {
      throw new SeimBadRequestException(error.message);
    }
  }
}
