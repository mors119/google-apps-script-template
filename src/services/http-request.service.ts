import type {
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from '../infrastructure/apps-script-http.client';
import type { LoggerService } from '../infrastructure/apps-script.logger';
import { parseJson } from '../utils/json';

export interface JsonRequestOptions {
  readonly headers?: Readonly<Record<string, string>>;
}

export class HttpRequestService {
  public constructor(
    private readonly httpClient: HttpClient,
    private readonly logger: LoggerService,
  ) {}

  public getJson<T>(url: string, options: JsonRequestOptions = {}): T {
    const request: HttpClientRequest = {
      url,
      method: 'get',
      ...(options.headers ? { headers: options.headers } : {}),
    };

    const response = this.httpClient.fetch(request);
    this.ensureSuccess(response, url);
    this.logger.info('HTTP request completed', {
      statusCode: response.statusCode,
      url,
    });

    return parseJson<T>(response.body);
  }

  private ensureSuccess(response: HttpClientResponse, url: string): void {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return;
    }

    throw new Error(`HTTP request to ${url} failed with status ${response.statusCode}`);
  }
}
