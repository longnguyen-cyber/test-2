import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  HealthTopic,
  HealthTopicHabit,
  HealthTopicHabitTask,
  Translation,
  User,
} from '../../domain/entities';
import { TranslationService } from './translation.service';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([HealthTopicHabit, Translation, HealthTopicHabitTask, HealthTopic]),
  ],
  providers: [TranslationService],
  exports: [TranslationService],
})
export class TranslationModule {}
