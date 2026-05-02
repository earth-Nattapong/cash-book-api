import { registerAs } from '@nestjs/config';
import { AllConfigType } from './config.type';

export default registerAs('database', (): AllConfigType['database'] => ({
  url: process.env.DATABASE_URL || '',
}));
