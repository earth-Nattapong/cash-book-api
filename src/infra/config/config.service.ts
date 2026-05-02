import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { AllConfigType } from './config.type';
import { IConfigService } from './config.interface';

@Injectable()
export class ConfigService
  extends NestConfigService<AllConfigType, true>
  implements IConfigService
{
  isDevelopment(): boolean {
    return this.get('app.nodeEnv', { infer: true }) === 'development';
  }

  isProduction(): boolean {
    return this.get('app.nodeEnv', { infer: true }) === 'production';
  }
}
