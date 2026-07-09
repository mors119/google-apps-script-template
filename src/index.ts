import { CONFIG_KEYS } from './config/config-keys';
import { createAppContainer } from './config/service-container';
import { handleOnOpen } from './triggers/on-open.trigger';

const container = createAppContainer();

const onOpen = (): void => {
  handleOnOpen(container);
};

const runTemplateDemo = (): void => {
  const result = container.templateDemoService.run();
  SpreadsheetApp.getUi().alert(result);
};

const showConfigurationHelp = (): void => {
  const message = [
    `Set ${CONFIG_KEYS.productApi} in Script Properties.`,
    `Optionally set ${CONFIG_KEYS.menuTitle}.`,
  ].join('\n');

  SpreadsheetApp.getUi().alert(
    'Configuration Required',
    message,
    SpreadsheetApp.getUi().ButtonSet.OK,
  );
};

Object.assign(globalThis, {
  onOpen,
  runTemplateDemo,
  showConfigurationHelp,
});
