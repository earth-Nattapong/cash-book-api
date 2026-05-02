import {
  createLogger,
  format,
  transports,
  Logger as WinstonLogger,
  Logform,
} from 'winston';
import { Injectable, LoggerService } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { ILoggerService } from './logger.interface';

interface LogContext {
  traceId?: string;
  [key: string]: unknown;
}

export const logContextStorage = new AsyncLocalStorage<LogContext>();

interface LogInfo extends Logform.TransformableInfo {
  timestamp: string;
  level: string;
  message: string;
  traceId?: string;
  stack?: string;
}

@Injectable()
export class Logger implements LoggerService, ILoggerService {
  private logger: WinstonLogger;

  constructor() {
    this.logger = createLogger({
      level: 'debug',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.printf((info: Logform.TransformableInfo) => {
          const { timestamp, level, message, traceId, stack, ...meta } =
            info as LogInfo;
          const context = logContextStorage.getStore();
          const currentTraceId = traceId || context?.traceId || 'N/A';

          let log = `${String(timestamp)} [${level.toUpperCase().padEnd(7)}] [TraceID: ${currentTraceId}] ${String(message)}`;

          if (Object.keys(meta).length > 0) {
            log += ` ${JSON.stringify(meta)}`;
          }

          if (stack) {
            log += `\n${String(stack)}`;
          }

          return log;
        }),
      ),
      transports: [new transports.Console()],
    });
  }

  log(message: string, context?: string | Record<string, unknown>) {
    this.logger.info(message, {
      ...(typeof context === 'object' ? context : { context }),
    });
  }

  error(
    message: string,
    trace?: string,
    context?: string | Record<string, unknown>,
  ) {
    this.logger.error(message, {
      stack: trace,
      ...(typeof context === 'object' ? context : { context }),
    });
  }

  warn(message: string, context?: string | Record<string, unknown>) {
    this.logger.warn(message, {
      ...(typeof context === 'object' ? context : { context }),
    });
  }

  debug(message: string, context?: string | Record<string, unknown>) {
    this.logger.debug(message, {
      ...(typeof context === 'object' ? context : { context }),
    });
  }

  verbose(message: string, context?: string | Record<string, unknown>) {
    this.logger.verbose(message, {
      ...(typeof context === 'object' ? context : { context }),
    });
  }
}
