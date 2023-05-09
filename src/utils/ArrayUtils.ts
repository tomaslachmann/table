type KeyOfType<T> = keyof T;

export function removeDuplicates<T>(arr: T[], key: KeyOfType<T>): T[] {
  const seen = new Set();
  return arr.filter((item) => {
    const property = item[key];
    return seen.has(property) ? false : seen.add(property);
  });
}