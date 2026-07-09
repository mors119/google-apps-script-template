import { ConfigService } from './config.service';
import { ScriptPropertiesConfigurationProvider } from '../infrastructure/script-properties-configuration.provider';
import { AppsScriptLogger } from '../infrastructure/apps-script.logger';
import { AppsScriptHttpClient } from '../infrastructure/apps-script-http.client';
import { HttpRequestService } from '../services/http-request.service';
import { TemplateDemoService } from '../services/template-demo.service';

export interface AppContainer {
  readonly configService: ConfigService;
  readonly httpRequestService: HttpRequestService;
  readonly templateDemoService: TemplateDemoService;
  readonly logger: AppsScriptLogger;
}

export const createAppContainer = (): AppContainer => {
  const configService = new ConfigService(
    new ScriptPropertiesConfigurationProvider(PropertiesService.getScriptProperties()),
  );
  const logger = new AppsScriptLogger();
  const httpRequestService = new HttpRequestService(new AppsScriptHttpClient(), logger);
  const templateDemoService = new TemplateDemoService(configService, httpRequestService, logger);

  return {
    configService,
    httpRequestService,
    templateDemoService,
    logger,
  };
};
