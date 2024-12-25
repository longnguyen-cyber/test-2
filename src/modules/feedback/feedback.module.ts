import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { CqrsModule, QueryHandler } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  Mining,
  UserHabit,
  HealthTopicHabit,
  HealthTopicHabitTask,
  HealthTopicHabitTaskHistory,
} from 'src/domain/entities';
import { QueryHandlers } from './quereies';
import { CommandHandlers } from './command';
import { JwtService } from '@nestjs/jwt';
import { Feedback } from 'src/domain/entities/feedback.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      User,
      Feedback,
      Mining,
      UserHabit,
      HealthTopicHabit,
      HealthTopicHabitTask,
      HealthTopicHabitTaskHistory,
    ]),
  ],
  controllers: [FeedbackController],
  providers: [...QueryHandlers, ...CommandHandlers, JwtService],
})
export class FeedbackModule {}
