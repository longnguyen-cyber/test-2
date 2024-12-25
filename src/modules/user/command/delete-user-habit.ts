import { CommandHandler, ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserHabit } from '../../../domain/entities';
import { UserService } from '../user.service';
import { SeimBadRequestException } from '../../../common/exception';

export class DeleteUserHabitCommand {
  constructor(public readonly consumerId: string, public readonly habitId: string) {}
}

@CommandHandler(DeleteUserHabitCommand)
export class DeleteUserHabitCommandHandler implements ICommandHandler<DeleteUserHabitCommand> {
  constructor(
    @InjectRepository(UserHabit)
    private readonly userHabitRepo: Repository<UserHabit>,
    private readonly userService: UserService,
  ) {}

  async execute(input: DeleteUserHabitCommand): Promise<void> {
    const { consumerId, habitId } = input;
    const userHabits = await this.userService.getUserHabits(consumerId);
    const remainHabits = userHabits.filter((userHabit) => userHabit.habitId !== habitId);

    if (remainHabits.length === userHabits.length) {
      throw new SeimBadRequestException('Habit does not existed on User profile');
    }

    this.userHabitRepo.delete({
      habitId,
      consumerId,
    });
  }
}
