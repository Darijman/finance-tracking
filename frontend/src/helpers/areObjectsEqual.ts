export const areObjectsEqual = <T extends { [K in keyof T]: string }>(obj1: T, obj2: T): boolean => {
  return (Object.keys(obj1) as (keyof T)[]).every((key) => obj1[key]?.trim() === obj2[key]?.trim());
};
