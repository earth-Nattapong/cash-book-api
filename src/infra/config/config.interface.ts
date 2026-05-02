export const ConfigToken = {
  Service: Symbol('ConfigService'),
};

export interface IConfigService {
  get<T>(key: string): T;
  isDevelopment(): boolean;
  isProduction(): boolean;
}
