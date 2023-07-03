export const intersection = <T>(a: T[], b: T[]) =>
  a.filter((value) => b.includes(value));

export const chunk = <T>(array: T[], size: number) =>
  array.reduce(
    (newarr, _, i) =>
      i % size ? newarr : [...newarr, array.slice(i, i + size)],
    [] as T[][]
  );

export const isStringArray = (arg: unknown): arg is string[] =>
  Array.isArray(arg) && arg.every((item) => typeof item === 'string');

export const isIterable = (obj: unknown): obj is Iterable<unknown> =>
  typeof obj === 'object' && obj !== null && Symbol.iterator in obj;

export const convertToCron = (time: string) => {
  const [hour, minute] = time.split(':');

  return `${minute} ${hour} * * *`;
};
