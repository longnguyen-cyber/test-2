import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { NoticeController } from './notice.controller';
import { NotificationService } from './notice.service';
import { QueryHandlers } from './queries';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CqrsModule, ConfigModule],
  providers: [...QueryHandlers, NotificationService],
  controllers: [NoticeController],
})
export class NoticeModule {}
