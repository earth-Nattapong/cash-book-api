export const LoggerToken = {
  Service: Symbol('LoggerService'),
};

export interface ILoggerService {
  log(message: string, context?: Record<string, unknown>): void;
  error(
    message: string,
    trace?: string,
    context?: Record<string, unknown>,
  ): void;
  warn(message: string, context?: Record<string, unknown>): void;
  debug(message: string, context?: Record<string, unknown>): void;
  verbose(message: string, context?: Record<string, unknown>): void;
}
