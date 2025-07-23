import {
  NotFoundException,
  ForbiddenException,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

export function throwNotFound(message: string): never {
  throw new NotFoundException(message);
}

export function throwForbidden(message: string): never {
  throw new ForbiddenException(message);
}

/**
 * Extracts error details from an HttpException or generic error object.
 */
function extractErrorDetails(exception: unknown): {
  status: number;
  message: string | string[];
  errorType?: string;
  errorCode?: string | number;
  stack?: string;
} {
  let status = HttpStatus.INTERNAL_SERVER_ERROR;
  let message: string | string[] = 'Internal server error';
  let errorType: string | undefined = undefined;
  let errorCode: string | number | undefined = undefined;
  let stack: string | undefined = undefined;

  if (exception instanceof HttpException) {
    status = exception.getStatus();
    const res = exception.getResponse();
    message = typeof res === 'string' ? res : (res as any)?.message || message;
    errorType = exception.name;
    if ((res as any)?.error) errorType = (res as any).error;
    stack = (exception as any)?.stack;
  } else if (exception && typeof exception === 'object') {
    errorType = (exception as any)?.name || exception.constructor?.name;
    message = (exception as any)?.message || message;
    errorCode = (exception as any)?.code;
    stack = (exception as any)?.stack;
  }

  return { status, message, errorType, errorCode, stack };
}

/**
 * Global exception filter that returns detailed error information.
 *
 * Error response structure:
 * {
 *   statusCode: number,
 *   message: string | string[],
 *   errorType?: string,
 *   errorCode?: string | number,
 *   stack?: string // only in non-production
 * }
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { status, message, errorType, errorCode } = extractErrorDetails(exception);

    const errorResponse: Record<string, unknown> = {
      statusCode: status,
      message,
      errorType,
      errorCode,
    };
    Object.keys(errorResponse).forEach(
      (key) => errorResponse[key] === undefined && delete errorResponse[key],
    );
    response.status(status).json(errorResponse);
  }
}
