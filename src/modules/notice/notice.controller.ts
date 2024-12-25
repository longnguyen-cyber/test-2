import { Body, Controller, Get, Post } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { PushNoticeQuery } from './queries';
import { CurrentConsumer, CurrentConsumerInfo } from 'src/common/decorator';

@Controller('notices')
@ApiTags('notices')
export class NoticeController {
  constructor(private readonly queryBus: QueryBus) {}

  @Post()
  async sendNotification(
    @Body('fcmToken') fcmToken: string,
    @CurrentConsumer() consumer: CurrentConsumerInfo,
  ): Promise<void> {
    return this.queryBus.execute(new PushNoticeQuery(fcmToken, consumer.id));
  }
}
