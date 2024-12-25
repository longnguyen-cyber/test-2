import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthTopicHabit, User, Version } from '../../domain/entities';
// import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { Web3Controller } from './web3.controller';
import { Web3Service } from './web3.service';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User, HealthTopicHabit, Version])],
  controllers: [Web3Controller],
  providers: [...QueryHandlers, Web3Service],
})
export class Web3Module {}
