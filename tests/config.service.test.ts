import { describe, expect, it } from 'vitest';

import { CONFIG_KEYS } from '../src/config/config-keys';
import { ConfigService, type ConfigurationProvider } from '../src/config/config.service';

class InMemoryConfigurationProvider implements ConfigurationProvider {
  public constructor(private readonly values: Partial<Record<string, string>>) {}

  public get(key: string): string | null {
    return this.values[key] ?? null;
  }
}

describe('ConfigService', () => {
  it('returns a required configuration value', () => {
    const service = new ConfigService(
      new InMemoryConfigurationProvider({
        [CONFIG_KEYS.productApi]: 'configured-endpoint',
      }),
    );

    expect(service.getRequired(CONFIG_KEYS.productApi)).toBe('configured-endpoint');
  });

  it('returns a numeric configuration value', () => {
    const service = new ConfigService(
      new InMemoryConfigurationProvider({
        [CONFIG_KEYS.menuTitle]: '15000',
      }),
    );

    expect(service.getNumber(CONFIG_KEYS.menuTitle, 3000)).toBe(15000);
  });

  it('throws when a required value is missing', () => {
    const service = new ConfigService(new InMemoryConfigurationProvider({}));

    expect(() => service.getRequired(CONFIG_KEYS.productApi)).toThrow(
      /Missing required configuration value/,
    );
  });
});
