import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { QueryHandlers } from './queries';
import {
  HealthTopicHabit,
  HealthTopicHabitTask,
  HealthTopicHabitTaskHistory,
  Mining,
  User,
  UserHabit,
} from '../../domain/entities';
import { MiningController } from './mining.controller';
import { CommandHandlers } from './command';
import { MiningService } from './mining.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      User,
      Mining,
      UserHabit,
      HealthTopicHabit,
      HealthTopicHabitTask,
      HealthTopicHabitTaskHistory,
    ]),
  ],
  controllers: [MiningController],
  providers: [JwtService, UserService, MiningService, ...QueryHandlers, ...CommandHandlers],
})
export class MiningModule {}
