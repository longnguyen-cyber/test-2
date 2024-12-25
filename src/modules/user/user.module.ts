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
  Mining,
  User,
  UserHabit,
} from '../../domain/entities';
import { UserController } from './user.controller';
import { CommandHandlers } from './command';
import { UserService } from './user.service';
import { TaskService } from '../task/task.service';
import { TranslationService } from '../translation/translation.service';

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
      Mining,
    ]),
  ],
  controllers: [UserController],
  providers: [
    TranslationService,
    JwtService,
    TaskService,
    UserService,
    ...QueryHandlers,
    ...CommandHandlers,
  ],
})
export class UserModule {}
