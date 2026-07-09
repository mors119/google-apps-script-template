export const parseJson = <T>(value: string): T => {
  return JSON.parse(value) as T;
};
