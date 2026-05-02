import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { Logger, logContextStorage } from './logger.service';
import { TraceIdMiddleware } from './trace-id.middleware';
import { LoggingInterceptor } from './logging.interceptor';
import { ResponseInterceptor } from './response.interceptor';

@Module({
  providers: [Logger, LoggingInterceptor, ResponseInterceptor],
  exports: [Logger, LoggingInterceptor, ResponseInterceptor],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TraceIdMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

export { logContextStorage };
