import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  @Inject('winston')
  private readonly logger!: Logger;

  use(request: Request | any, response: Response, next: NextFunction): void {
    if (process.env.DISABLE_LOG_REQUEST !== 'true') {
      const { ip, method, originalUrl } = request;
      const userAgent = request.get('user-agent') || '';
      const now = Date.now();
      response.on('finish', () => {
        const { statusCode } = response;
        const consumer = request.consumer || '';
        const executeTime = Date.now() - now;
        this.logger.info(
          `${method} ${originalUrl} ${statusCode} ${executeTime}ms - ${userAgent} ${ip} ${consumer}`,
        );
      });
    }
    next();
  }
}
