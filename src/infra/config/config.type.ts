export interface DatabaseConfig {
  url: string;
}

export interface AppConfig {
  nodeEnv: string;
  port: number;
}

export interface AllConfigType {
  app: AppConfig;
  database: DatabaseConfig;
}
