import { CommandHandler, ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { UserService } from '../user.service';
import { SeimBadRequestException } from '../../../common/exception';
import { UserHabit } from '../../../domain/entities';

export class UpdateUserHabitCommand {
  constructor(public readonly consumerId: string, public readonly habitId: string) {}
}

@CommandHandler(UpdateUserHabitCommand)
export class UpdateUserHabitCommandHandler implements ICommandHandler<UpdateUserHabitCommand> {
  constructor(
    @InjectRepository(UserHabit)
    private readonly userHabitRepo: Repository<UserHabit>,
    private readonly userService: UserService,
  ) {}

  async execute(input: UpdateUserHabitCommand): Promise<void> {
    try {
      const { consumerId, habitId } = input;

      const habitDetail = await this.userService.getHabitDetail(habitId);

      const userHabit = await this.userHabitRepo.findOne({
        where: { habitId, consumerId },
      });

      if (!userHabit) {
        //create new user habit
        this.userHabitRepo.save({
          habitId,
          consumerId,
          startDate: null,
          endDate: null,
        });
      } else {
        this.userHabitRepo.update(
          { habitId, consumerId },
          {
            startDate: dayjs().startOf('day').toDate(),
            endDate: dayjs().add(habitDetail.days, 'day').startOf('day').toDate(),
          },
        );
      }
    } catch (error) {
      console.log('error', error);
      throw new SeimBadRequestException("Can't update user habit");
    }
  }
}
