export function unwrap<T>(value: undefined | null | T): T {
  if (value == null) {
    throw new Error("value must not be nullish");
  }

  return value;
}
