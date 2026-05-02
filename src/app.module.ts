import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './infra/config';
import { LoggerModule } from './infra/logger';
import { DatabaseModule } from './infra/database';

@Module({
  imports: [ConfigModule, LoggerModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
