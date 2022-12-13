export const omitUndefinedProperties = <T extends Record<string, unknown>>(
  obj: T
): Partial<T> => {
  const cloneObj = Object.assign(obj);
  const keys = Object.keys(cloneObj);
  keys.forEach((key) => {
    if (cloneObj[key] === undefined) {
      delete cloneObj[key];
    }
  });
  return cloneObj;
};
