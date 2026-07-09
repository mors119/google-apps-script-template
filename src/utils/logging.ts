export const serializeContext = (context: Readonly<Record<string, unknown>>): string => {
  return JSON.stringify(context);
};
