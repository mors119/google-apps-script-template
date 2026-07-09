import type { ConfigKey } from './config-keys';

export interface ConfigurationProvider {
  get(key: ConfigKey): string | null;
}

export class ConfigService {
  public constructor(private readonly provider: ConfigurationProvider) {}

  public getRequired(key: ConfigKey): string {
    const value = this.provider.get(key);

    if (!value) {
      throw new Error(`Missing required configuration value for key: ${key}`);
    }

    return value;
  }

  public getOptional(key: ConfigKey): string | null {
    return this.provider.get(key);
  }

  public getNumber(key: ConfigKey, fallbackValue: number): number {
    const rawValue = this.provider.get(key);

    if (!rawValue) {
      return fallbackValue;
    }

    const parsedValue = Number(rawValue);

    if (Number.isNaN(parsedValue)) {
      throw new Error(`Configuration key ${key} must be numeric`);
    }

    return parsedValue;
  }
}
