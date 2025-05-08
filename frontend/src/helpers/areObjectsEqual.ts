export const areObjectsEqual = <T extends Record<string, any>>(obj1: T, obj2: T): boolean => {
  return Object.keys(obj1).every((key) => {
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (typeof val1 === 'string' && typeof val2 === 'string') {
      return val1.trim() === val2.trim();
    }

    return val1 === val2;
  });
};
