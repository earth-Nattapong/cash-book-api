import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export interface DatabaseService extends OnModuleInit, OnModuleDestroy {
  get database(): PrismaClient;
  closeConnection(): Promise<void>;
  healthCheck(): Promise<boolean>;
  seedDatabase(): Promise<void>;
}
