import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  Logger,
  LoggingInterceptor,
  ResponseInterceptor,
} from './infra/logger';
import { DatabaseService } from './infra/database';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = app.get(Logger);
  app.useLogger(logger);

  app.setGlobalPrefix('api/v1');

  app.useGlobalInterceptors(app.get(LoggingInterceptor));
  app.useGlobalInterceptors(app.get(ResponseInterceptor));

  const databaseService = app.get(DatabaseService);
  await databaseService.healthCheck();
  await databaseService.seedDatabase();

  await app.listen(process.env.PORT ?? 8080);
  logger.log(`Application started on port ${process.env.PORT ?? 8080}`);
}
void bootstrap();
