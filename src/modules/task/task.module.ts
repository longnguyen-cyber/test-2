import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { QueryHandlers } from './queries';
import {
  HealthTopic,
  HealthTopicHabit,
  HealthTopicHabitTask,
  HealthTopicHabitTaskHistory,
  User,
  UserHabit,
} from '../../domain/entities';
import { TaskController } from './task.controller';
import { CommandHandlers } from './command';
import { UserService } from '../user/user.service';
import { TaskService } from './task.service';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      User,
      UserHabit,
      HealthTopic,
      HealthTopicHabit,
      HealthTopicHabitTask,
      HealthTopicHabitTaskHistory,
    ]),
  ],
  controllers: [TaskController],
  providers: [JwtService, UserService, ...QueryHandlers, ...CommandHandlers],
})
export class TaskModule {}
