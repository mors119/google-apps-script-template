import { CONFIG_KEYS } from '../config/config-keys';
import type { ConfigService } from '../config/config.service';

export const installRootMenu = (configService: ConfigService): void => {
  const ui = SpreadsheetApp.getUi();
  const menuTitle = configService.getOptional(CONFIG_KEYS.menuTitle) ?? 'Template Tools';

  ui.createMenu(menuTitle)
    .addItem('Run Template Demo', 'runTemplateDemo')
    .addItem('Show Configuration Help', 'showConfigurationHelp')
    .addToUi();
};
