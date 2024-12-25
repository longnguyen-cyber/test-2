import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as firebase from 'firebase-admin';
import { HealthTopicHabit, User, Version } from '../../domain/entities';
import { CommandHandlers } from './commands';
import { configAppSetting } from '../../config/consts';
import { VersionController } from './version.controller';
import { QueryHandlers } from './queries';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User, HealthTopicHabit, Version])],
  controllers: [VersionController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class VersionModule {}
