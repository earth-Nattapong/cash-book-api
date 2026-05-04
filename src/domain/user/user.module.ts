import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { DatabaseModule } from '../../infra/database';
import { LoggerModule } from '../../infra/logger';

@Module({
  imports: [DatabaseModule, LoggerModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'IUserService',
      useExisting: UserService,
    },
    UserRepository,
  ],
  exports: [UserService],
})
export class UserModule {}
