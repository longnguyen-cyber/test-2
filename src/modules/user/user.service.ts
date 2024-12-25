import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nullable, OrderBy } from 'src/common/constant';
import { SeimBadRequestException } from 'src/common/exception';
import { HealthTopicHabit, HealthTopicHabitTaskHistory, User } from 'src/domain/entities';
import { UserHabit } from 'src/domain/entities/user-habit.entity';
import { getLevelByRefCount } from 'src/shared/utils';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserHabit)
    private readonly userHabitRepo: Repository<UserHabit>,
    @InjectRepository(HealthTopicHabit)
    private readonly habitRepo: Repository<HealthTopicHabit>,

    @InjectRepository(HealthTopicHabitTaskHistory)
    private readonly taskHistoryRepo: Repository<HealthTopicHabitTaskHistory>,
  ) {}

  async getMiningInfo(
    consumerId: string,
  ): Promise<{ refCount: number; level: number; boost: number }> {
    const refCount = await this.userRepo.count({
      where: {
        referBy: consumerId,
      },
    });
    const boostAddition = await this.userRepo.findOne({
      where: {
        id: consumerId,
      },
      select: ['boost'],
    });

    const level = getLevelByRefCount(refCount);
    const boost = refCount > 50 ? 50 : refCount + (boostAddition ? boostAddition.boost : 0);
    console.log('boost', boost);

    return {
      refCount,
      level,
      boost, //greather than 50, return 50, otherwise return refCount(1 ref ~ 1% max 50%)
    };
  }

  async getReferralInfo(consumerId: string): Promise<{ totalInvited: number; totalValid: number }> {
    const totalInvited = await this.userRepo.count({
      where: {
        referBy: consumerId,
      },
    });

    const totalValid = await this.userRepo.count({
      where: {
        referBy: consumerId,
        isVerified: true,
      },
    });

    return {
      totalInvited,
      totalValid,
    };
  }

  async getUserInfo(consumerId: string): Promise<User> {
    const user = await this.userRepo.findOneOrFail({
      where: {
        id: consumerId,
      },
    });

    return user;
  }

  async getUserInfoByReferralCode(referralCode: string): Promise<User> {
    const user = await this.userRepo.findOneOrFail({
      where: {
        refererCode: referralCode,
      },
    });

    return user;
  }

  async getUserHabits(consumerId: string): Promise<UserHabit[]> {
    const habits = await this.userHabitRepo.find({
      where: {
        consumerId,
      },
      relations: ['habit'],
    });

    return habits;
  }

  async getUserHabitWithTask(
    habitId: string,
    consumerId: string,
    taskId: string,
  ): Promise<Nullable<UserHabit>> {
    const userHabit = await this.userHabitRepo
      .createQueryBuilder('userHabit')
      .leftJoinAndSelect('userHabit.habit', 'habit')
      .leftJoinAndSelect('habit.tasks', 'tasks', 'tasks.id = :taskId', { taskId })
      .leftJoinAndSelect(
        'tasks.histories',
        'histories',
        'DATE(histories.createdAt) = CURDATE() AND histories.consumerId = :consumerId',
        {
          consumerId,
        },
      )
      .where('userHabit.habitId = :habitId', { habitId }) // Sử dụng habitId thay vì userHabitId
      .andWhere('userHabit.consumerId = :consumerId', { consumerId })
      .andWhere('CURDATE() BETWEEN DATE(userHabit.startDate) AND DATE(userHabit.endDate)')
      .orderBy('userHabit.createdAt', OrderBy.DESC)
      .getOne();

    return userHabit;
  }

  async getHabitDetail(habitId: string): Promise<HealthTopicHabit> {
    const habit = await this.habitRepo.findOne({
      where: {
        id: habitId,
      },
    });

    if (!habit) throw new SeimBadRequestException('Habit not found');

    return habit;
  }

  async updateUserPoint(consumerId: string, point: number): Promise<void> {
    await this.userRepo.increment({ id: consumerId }, 'point', point);
  }

  async checkProgress(consumerId: string): Promise<any> {
    const habits = await this.userHabitRepo.find({
      where: {
        consumerId,
      },
      relations: ['habit', 'habit.tasks'],
    });

    const totalTaskEachHabit = habits.map((habit) => {
      const tasks = habit.habit.tasks;
      return {
        habitId: habit.habitId,
        taskId: tasks.map((task) => task.id),
        totalTasks: tasks.length * habit.habit.days,
      };
    });

    const taskHistoriesOfUser = await this.taskHistoryRepo.find({
      where: {
        consumerId,
        isFinished: true,
      },
    });

    const countTaskMap = new Map();
    const pointsMap = new Map();

    taskHistoriesOfUser.forEach((history) => {
      const count = countTaskMap.get(history.taskId) || 0;
      countTaskMap.set(history.taskId, count + 1);

      const points = pointsMap.get(history.taskId) || 0;
      pointsMap.set(history.taskId, points + Number(history.point));
    });

    const habitCompletionStatus = totalTaskEachHabit.map((habit) => {
      const completedTasksCount = habit.taskId
        .map((taskId) => countTaskMap.get(taskId) || 0)
        .reduce((acc, count) => acc + count, 0);
      const totalPoints = habit.taskId
        .map((taskId) => pointsMap.get(taskId) || 0)
        .reduce((acc, points) => acc + points, 0);
      return {
        habitId: habit.habitId,
        isCompleted: completedTasksCount >= habit.totalTasks,
        completedTasks: completedTasksCount,
        totalTasks: habit.totalTasks,
        totalPoints,
      };
    });

    return habitCompletionStatus;
  }
}
