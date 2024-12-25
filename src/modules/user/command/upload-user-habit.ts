import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserHabit } from 'src/domain/entities';
import { Repository } from 'typeorm';
import { UserService } from '../user.service';
import { SeimBadRequestException } from 'src/common/exception';
import { CreateHabitRequestDto } from '../dto';
import * as dayjs from 'dayjs';

export class UploadUserHabitCommand {
  constructor(public readonly consumerId: string, public readonly data: CreateHabitRequestDto[]) {}
}

@CommandHandler(UploadUserHabitCommand)
export class UploadUserHabitCommandHandler implements ICommandHandler<UploadUserHabitCommand> {
  constructor(
    @InjectRepository(UserHabit)
    private readonly userHabitRepo: Repository<UserHabit>,

    private readonly userService: UserService,
  ) {}

  async execute(input: UploadUserHabitCommand): Promise<void> {
    try {
      const { consumerId, data } = input;

      for (const habit of data) {
        const habitDetail = await this.userService.getHabitDetail(habit.habitId);
        const existUserHabit = await this.userHabitRepo.findOne({
          where: {
            habitId: habit.habitId,
            consumerId,
          },
        });

        if (existUserHabit) {
          await this.userHabitRepo.update(
            {
              habitId: habit.habitId,
              consumerId,
            },
            {
              startDate: habit.startDate,
              endDate: dayjs(habit.startDate).add(habitDetail.days, 'day').startOf('day').toDate(),
            },
          );
        } else
          await this.userHabitRepo.insert({
            habitId: habit.habitId,
            consumerId,
            startDate: habit.startDate,
            endDate: dayjs(habit.startDate).add(habitDetail.days, 'day').startOf('day').toDate(),
          });
      }
    } catch (error) {
      console.log('error', error);
      throw new SeimBadRequestException("Can't update user habit");
    }
  }
}
