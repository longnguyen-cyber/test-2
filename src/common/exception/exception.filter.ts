import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { Logger } from 'winston';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Response, Request } from 'express';
import { SeimException, SeimInternalServerError, SeimNotRouteFoundError } from './exception';

@Catch()
export class GlobalHandleExceptionFilter implements ExceptionFilter {
  @Inject('winston')
  private readonly logger!: Logger;

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    this.logException(request, exception);

    if (exception instanceof SeimException) {
      GlobalHandleExceptionFilter.sendResponse(request, response, exception);
    } else if (exception instanceof NotFoundException) {
      GlobalHandleExceptionFilter.sendResponse(request, response, new SeimNotRouteFoundError());
    } else {
      let error = new SeimInternalServerError();
      if (process.env.ENABLE_VERBOSE_ERR_RESPONSE === 'true') {
        error = new SeimInternalServerError(undefined, exception.stack);
      }
      GlobalHandleExceptionFilter.sendResponse(request, response, error);
    }
  }

  private logException(request: Request, exception: HttpException): void {
    this.logger.error({
      ...exception,
      stack: exception.stack,
      traceId: request.header('x-client-trace-id'),
    });
  }

  private static sendResponse(
    request: Request,
    response: Response,
    exception: SeimException,
  ): void {
    const traceId = request.header('x-client-trace-id');
    response.status(exception.getStatus()).json(exception.prepareResponse(traceId));
  }
}
