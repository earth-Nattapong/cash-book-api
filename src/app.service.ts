import { Injectable } from '@nestjs/common';
import { DatabaseService } from './infra/database';

@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService) {}

  getHello(): string {
    return 'Hello World!';
  }

  getPing(): string {
    return 'pong';
  }

  async getHealth() {
    const isHealthy = await this.databaseService.healthCheck();

    return {
      status: isHealthy ? 'ok' : 'error',
      database: isHealthy ? 'connected' : 'disconnected',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
