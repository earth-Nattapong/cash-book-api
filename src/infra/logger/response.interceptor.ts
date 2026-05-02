import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { logContextStorage } from './logger.service';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map(
        (
          data: Record<string, unknown> | null | string | number | boolean,
        ): Record<string, unknown> => {
          const ctx = logContextStorage.getStore();
          const traceId = ctx?.traceId || 'N/A';

          if (typeof data === 'object' && data !== null) {
            return {
              ...data,
              traceId,
            };
          }

          return {
            data,
            traceId,
          };
        },
      ),
    );
  }
}
