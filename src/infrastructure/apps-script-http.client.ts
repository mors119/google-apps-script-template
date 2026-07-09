import { mapHeaders } from '../utils/http';

export interface HttpClientRequest {
  readonly url: string;
  readonly method: GoogleAppsScript.URL_Fetch.HttpMethod;
  readonly headers?: Readonly<Record<string, string>>;
  readonly payload?: string;
}

export interface HttpClientResponse {
  readonly statusCode: number;
  readonly body: string;
  readonly headers: Readonly<Record<string, string>>;
}

export interface HttpClient {
  fetch(request: HttpClientRequest): HttpClientResponse;
}

export class AppsScriptHttpClient implements HttpClient {
  public fetch(request: HttpClientRequest): HttpClientResponse {
    const response = UrlFetchApp.fetch(request.url, {
      method: request.method,
      headers: request.headers,
      payload: request.payload,
      muteHttpExceptions: true,
      contentType: 'application/json',
    });

    return {
      statusCode: response.getResponseCode(),
      body: response.getContentText(),
      headers: mapHeaders(
        response.getAllHeaders() as Record<string, string | ReadonlyArray<string>>,
      ),
    };
  }
}
