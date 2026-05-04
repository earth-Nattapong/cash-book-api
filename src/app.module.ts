import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './infra/config';
import { LoggerModule } from './infra/logger';
import { DatabaseModule } from './infra/database';
import { UserModule } from './domain/user';

@Module({
  imports: [ConfigModule, LoggerModule, DatabaseModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
