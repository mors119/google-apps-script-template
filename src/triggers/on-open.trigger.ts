import type { AppContainer } from '../config/service-container';
import { installRootMenu } from '../menu/root-menu';

export const handleOnOpen = (container: AppContainer): void => {
  installRootMenu(container.configService);
};
