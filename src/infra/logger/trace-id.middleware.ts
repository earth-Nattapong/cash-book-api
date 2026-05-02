import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logContextStorage } from './logger.service';

@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const traceId = (req.headers['x-trace-id'] as string) || uuidv4();

    req.traceId = traceId;
    res.setHeader('X-Trace-ID', traceId);

    logContextStorage.run({ traceId }, () => {
      next();
    });
  }
}
