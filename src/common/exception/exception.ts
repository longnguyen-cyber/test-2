import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';

export type SeimExceptionInformation = {
  statusCode: number;
  message: string;
  data?: unknown;
};

export type SeimExceptionResponse = SeimExceptionInformation & {
  traceId?: string;
};

export class SeimException extends HttpException {
  private readonly customInformation: SeimExceptionInformation;

  constructor(statusCode: HttpStatus, message: string, data?: unknown) {
    super(message, statusCode);
    this.customInformation = {
      statusCode,
      message,
      data,
    };
  }

  prepareResponse(traceId?: string): SeimExceptionResponse {
    return {
      ...this.customInformation,
      traceId,
    };
  }
}

type DataError = {
  [key: string]: { [key: string]: string } | null;
};
export class SeimBadRequestException extends SeimException {
  constructor(message: string, data?: unknown) {
    super(HttpStatus.BAD_REQUEST, message, data);
  }

  static fromValidationErrors(errors: ValidationError[]): SeimBadRequestException {
    const data: DataError = {};
    const parseErrors = (
      errs: ValidationError[],
      result: DataError,
      parentProperty?: string,
    ): void => {
      errs.forEach((error) => {
        const property = parentProperty ? `${parentProperty}.${error.property}` : error.property;
        if (error.constraints) {
          // eslint-disable-next-line no-param-reassign
          result[property] = error.constraints;
        } else if (error.children?.length) {
          parseErrors(error.children, result, property);
        }
      });
    };
    parseErrors(errors, data);

    return new SeimBadRequestException('Validation failed', data);
  }
}

export class SeimUnauthorizedException extends SeimException {
  constructor(message: string, data?: unknown) {
    super(HttpStatus.UNAUTHORIZED, message, data);
  }
}

export class SeimNotAllowedException extends SeimException {
  constructor(message: string, data?: unknown) {
    super(HttpStatus.FORBIDDEN, message, data);
  }
}

export class SeimNotFoundException extends SeimException {
  constructor(message: string, data?: unknown) {
    super(HttpStatus.NOT_FOUND, message, data);
  }
}

export class SeimInternalServerError extends SeimException {
  constructor(message?: string, data?: unknown) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message || 'Internal Server Error', data);
  }
}

export class SeimServiceUnavailableServerError extends SeimException {
  constructor(message?: string, data?: unknown) {
    super(HttpStatus.SERVICE_UNAVAILABLE, message || 'Service is not available', data);
  }
}

export class SeimNotRouteFoundError extends SeimException {
  constructor() {
    super(HttpStatus.NOT_FOUND, 'No Route Found');
  }
}
