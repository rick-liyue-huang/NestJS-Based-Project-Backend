import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  LoggerService,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as requestIp from 'request-ip';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // const status = exception.getStatus();

    const responseBody = {
      headers: request.headers,
      query: request.query,
      params: request.params,
      body: request.body,
      ip: requestIp.getClientIp(request),
      timestamp: new Date().toISOString(),
      exception: exception['name'],
      error: exception['response'] || 'Internal Server Error',
    };
    this.logger.error('HttpExceptionFilter', responseBody);

    // response.status(status).json({
    //   statusCode: status,
    //   timestamp: new Date().toISOString(),
    //   path: request.url,
    //   method: request.method,
    //   message: exception.message || HttpException.name,
    // });

    httpAdapter.reply(responseBody, response, httpStatus);
  }
}
