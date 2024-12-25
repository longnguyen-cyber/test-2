import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { NotificationService } from '../notice.service';

export class PushNoticeQuery {
  constructor(public readonly fcmToken: string, public readonly userId: string) {}
}

@QueryHandler(PushNoticeQuery)
export class PushNoticeQueryHandler implements IQueryHandler<PushNoticeQuery> {
  constructor(private readonly noticeService: NotificationService) {}

  async execute(input: PushNoticeQuery): Promise<void> {
    const { fcmToken, userId } = input;
    // Call the service to send push notification
    await this.noticeService.sendPushNotification(fcmToken, userId);
  }
}
