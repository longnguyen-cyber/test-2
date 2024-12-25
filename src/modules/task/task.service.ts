import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HealthTopicHabitTaskHistory } from 'src/domain/entities';
import { Between, Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(HealthTopicHabitTaskHistory)
    private readonly taskHistoryRepo: Repository<HealthTopicHabitTaskHistory>,
  ) {}

  async getTaskHistory(consumerId: string, taskId: string): Promise<HealthTopicHabitTaskHistory> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const history = await this.taskHistoryRepo.find({
      where: {
        taskId: taskId,
        consumerId,
        isFinished: true,
        createdAt: Between(startOfDay, endOfDay),
      },
    });

    return history[0];
  }

  async getAllHistoriesByConsumerId(consumerId: string): Promise<HealthTopicHabitTaskHistory[]> {
    return this.taskHistoryRepo.find({
      where: {
        consumerId,
      },
    });
  }
}
