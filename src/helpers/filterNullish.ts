export function filterNullish<T>(array: (undefined | null | T)[]): T[] {
  return array.flatMap((value) => value ?? []);
}
