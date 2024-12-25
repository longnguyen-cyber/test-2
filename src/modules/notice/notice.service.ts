import { Inject, Injectable, Logger } from '@nestjs/common';
import * as firebase from 'firebase-admin';

@Injectable()
export class NotificationService {
  constructor() {}
  private readonly logger = new Logger(NotificationService.name);

  async sendPushNotification(fcmToken: string, userId: string) {
    try {
      const data = {
        card: 'THREE OF WANDS',
        category: 'Upright',
      };
      await firebase
        .messaging()
        .send({
          notification: {
            title: 'Hết giờ rồi!',
            body: `Thời gian của ${userId} đã hết`,
          },
          data: data,
          token: fcmToken,
        })
        .then((response) => {
          // this.logger.log('Successfully sent message:', response);
        })
        .catch((error) => {
          const errorCode = error.code;
          this.logger.error('Error sending message:', errorCode);
        });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}
