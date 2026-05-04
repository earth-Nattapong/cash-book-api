import { registerAs } from '@nestjs/config';
import { AllConfigType } from './config.type';

export default registerAs('app', (): AllConfigType['app'] => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '8080', 10),
}));
