import { describe, expect, it, vi } from 'vitest';

import { CONFIG_KEYS } from '../src/config/config-keys';
import { ConfigService, type ConfigurationProvider } from '../src/config/config.service';
import type { LoggerService } from '../src/infrastructure/apps-script.logger';
import { HttpRequestService } from '../src/services/http-request.service';
import { TemplateDemoService } from '../src/services/template-demo.service';
import type {
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from '../src/infrastructure/apps-script-http.client';

class InMemoryConfigurationProvider implements ConfigurationProvider {
  public constructor(private readonly values: Partial<Record<string, string>>) {}

  public get(key: string): string | null {
    return this.values[key] ?? null;
  }
}

class FakeHttpClient implements HttpClient {
  public constructor(private readonly response: HttpClientResponse) {}

  public fetch(_request: HttpClientRequest): HttpClientResponse {
    return this.response;
  }
}

describe('TemplateDemoService', () => {
  it('returns a success message with response keys', () => {
    const configService = new ConfigService(
      new InMemoryConfigurationProvider({
        [CONFIG_KEYS.productApi]: 'configured-endpoint',
      }),
    );
    const logger: LoggerService = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    const httpRequestService = new HttpRequestService(
      new FakeHttpClient({
        statusCode: 200,
        body: JSON.stringify({
          id: 1,
          name: 'Sample',
        }),
        headers: {},
      }),
      logger,
    );
    const service = new TemplateDemoService(configService, httpRequestService, logger);

    expect(service.run()).toContain('Response keys: id, name');
  });
});
