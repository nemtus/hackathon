export const convertFromFirestore = <T extends Record<string, unknown>>(
  obj: T
): Partial<T> => {
  const cloneObj = Object.assign(obj);
  const keys = Object.keys(cloneObj);
  keys.forEach((key) => {
    if (
      typeof cloneObj[key].toString === 'function' &&
      cloneObj[key].toString().startWith('Timestamp')
    ) {
      cloneObj[key] = cloneObj[key].toDate();
    }
  });
  return cloneObj;
};
