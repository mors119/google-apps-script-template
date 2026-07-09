import { CONFIG_KEYS } from '../config/config-keys';
import type { ConfigService } from '../config/config.service';
import type { LoggerService } from '../infrastructure/apps-script.logger';
import type { HttpRequestService } from './http-request.service';

export interface DemoApiResponse {
  readonly [key: string]: unknown;
}

export class TemplateDemoService {
  public constructor(
    private readonly configService: ConfigService,
    private readonly httpRequestService: HttpRequestService,
    private readonly logger: LoggerService,
  ) {}

  public run(): string {
    const endpoint = this.configService.getRequired(CONFIG_KEYS.productApi);
    const payload = this.httpRequestService.getJson<DemoApiResponse>(endpoint);

    const responseKeys = Object.keys(payload);
    this.logger.info('Template demo succeeded', {
      endpoint,
      responseKeys,
    });

    return responseKeys.length > 0
      ? `Template demo succeeded. Response keys: ${responseKeys.join(', ')}`
      : 'Template demo succeeded. Response payload was empty.';
  }
}
