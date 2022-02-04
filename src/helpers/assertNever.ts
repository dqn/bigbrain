export function assertNever(value: never): never {
  throw new Error(`unexpected value: '${value}'`);
}
