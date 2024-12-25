import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  HealthTopic,
  HealthTopicHabit,
  HealthTopicHabitTask,
  HealthTopicHabitTaskHistory,
  Mining,
  User,
  UserHabit,
} from '../../domain/entities';
import { CommandHandlers } from './commands';
import { ReferralController } from './referral.controller';
import { QueryHandlers } from './queires';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

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
  controllers: [ReferralController],
  providers: [...CommandHandlers, ...QueryHandlers, UserService, JwtService],
})
export class ReferralModule {}
