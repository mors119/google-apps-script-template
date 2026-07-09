export const mapHeaders = (
  headers: Record<string, string | ReadonlyArray<string>>,
): Readonly<Record<string, string>> => {
  const normalizedHeaders = Object.entries(headers).reduce<Record<string, string>>(
    (accumulator, [headerName, headerValue]) => {
      const normalizedValue = Array.isArray(headerValue)
        ? headerValue.join(', ')
        : String(headerValue);

      accumulator[headerName] = normalizedValue;
      return accumulator;
    },
    {},
  );

  return normalizedHeaders;
};
