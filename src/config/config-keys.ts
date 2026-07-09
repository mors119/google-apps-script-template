export const CONFIG_KEYS = {
  menuTitle: 'MENU_TITLE',
  productApi: 'PRODUCT_API',
} as const;

export type ConfigKey = (typeof CONFIG_KEYS)[keyof typeof CONFIG_KEYS];
