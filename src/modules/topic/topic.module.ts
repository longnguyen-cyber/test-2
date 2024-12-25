import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthTopic, HealthTopicHabit } from '../../domain/entities';
import { QueryHandlers } from './queries';
import { TopicController } from './topic.controller';
import { TranslationService } from '../translation/translation.service';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([HealthTopic, HealthTopicHabit])],
  controllers: [TopicController],
  providers: [...QueryHandlers, TranslationService],
})
export class TopicModule {}
