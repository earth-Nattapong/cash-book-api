import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  Logger,
  LoggingInterceptor,
  ResponseInterceptor,
} from './infra/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = app.get(Logger);
  app.useLogger(logger);

  app.useGlobalInterceptors(app.get(LoggingInterceptor));
  app.useGlobalInterceptors(app.get(ResponseInterceptor));

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Application started on port ${process.env.PORT ?? 3000}`);
}
void bootstrap();
