import { CommandHandler, ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { CreateHabitRequestDto } from '../dto';
import { UserService } from '../user.service';
import { SeimBadRequestException } from '../../../common/exception';
import { UserHabit } from '../../../domain/entities';

export class CreateUserHabitCommand {
  constructor(public readonly consumerId: string, public readonly data: CreateHabitRequestDto) {}
}

@CommandHandler(CreateUserHabitCommand)
export class CreateUserHabitCommandHandler implements ICommandHandler<CreateUserHabitCommand> {
  constructor(
    @InjectRepository(UserHabit)
    private readonly userHabitRepo: Repository<UserHabit>,
    private readonly userService: UserService,
  ) {}

  async execute(input: CreateUserHabitCommand): Promise<void> {
    const {
      consumerId,
      data: { habitId, isStart },
    } = input;

    const userHabits = await this.userService.getUserHabits(consumerId);

    if (userHabits.length === 5) {
      throw new SeimBadRequestException('User has max habit provide');
    }

    const existedHabit = userHabits.find((userHabit) => userHabit.id === habitId);

    if (existedHabit) throw new SeimBadRequestException('Habit already added');

    const habitDetail = await this.userService.getHabitDetail(habitId);

    this.userHabitRepo.insert({
      habitId,
      consumerId,
      startDate: isStart ? dayjs().startOf('day').toDate() : null,
      endDate: isStart ? dayjs().add(habitDetail.days, 'day').startOf('day').toDate() : null,
    });
  }
}
