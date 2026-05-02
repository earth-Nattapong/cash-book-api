import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { DatabaseService as IDatabaseService } from './database.interface';
import { ConfigService } from '../config/config.service';
import { Logger } from '../logger/logger.service';

@Injectable()
export class DatabaseService
  implements IDatabaseService, OnModuleInit, OnModuleDestroy
{
  private readonly prisma: PrismaClient;
  private readonly pool: Pool;

  constructor(
    private readonly config: ConfigService,
    private readonly logger: Logger,
  ) {
    const databaseUrl = this.config.get('database.url', { infer: true });
    this.pool = new Pool({ connectionString: databaseUrl });

    const adapter = new PrismaPg(this.pool);

    this.prisma = new PrismaClient({
      adapter,
      log: this.config.isDevelopment()
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    });
  }

  get database(): PrismaClient {
    return this.prisma;
  }

  async onModuleInit() {
    await this.prisma.$connect();
    await this.prisma.$executeRaw`SET timezone = 'Asia/Bangkok'`;
    this.logger.log('Connected to database with timezone Asia/Bangkok');
  }

  async onModuleDestroy() {
    await this.closeConnection();
  }

  async closeConnection(): Promise<void> {
    await this.prisma.$disconnect();
    await this.pool.end();
    this.logger.log('Disconnected from database');
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  async seedDatabase(): Promise<void> {
    const roles = ['user', 'admin'];

    for (const roleName of roles) {
      const existing = await this.prisma.roles.findUnique({
        where: { name: roleName },
      });

      if (!existing) {
        await this.prisma.roles.create({ data: { name: roleName } });
        this.logger.log(`Created role: ${roleName}`);
      }
    }

    this.logger.log('Database seeding completed');
  }
}
