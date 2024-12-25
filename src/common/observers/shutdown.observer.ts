import { INestApplication, Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Logger } from 'winston';

@Injectable()
export class ShutdownObserver implements OnApplicationShutdown {
  private app!: INestApplication;

  @Inject('winston')
  private readonly logger!: Logger;

  setupGracefulShutdown(app: INestApplication): void {
    app.enableShutdownHooks();
    this.app = app;
  }

  async onApplicationShutdown(signal?: string): Promise<void> {
    const server = this.app?.getHttpServer();

    if (signal) {
      this.logger.info(
        `[${signal}] Application is shutting down with signal`,
      );
      const shutdownTimeout = Number(process.env.READINESS_TIMEOUT_SECOND || 5);
      setTimeout(() => {
        this.logger.info('Shutting down gracefully');
        server?.close(() => {
          this.logger.info('Server close gracefully');
          process.exit(0);
        });
      }, shutdownTimeout * 1000);
    }
  }
}
