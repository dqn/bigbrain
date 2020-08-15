export const MAX_STACK_SIZE = 1024;

export type Stack<T> = {
  values: T[];
  pop: () => T;
  push: (value: T) => void;
};

export function createStack<T>(values: T[] = []): Stack<T> {
  return {
    values,
    pop() {
      if (!this.values.length) {
        throw new Error('stack underflow');
      }
      return this.values.pop()!;
    },
    push(value) {
      if (this.values.length === MAX_STACK_SIZE) {
        throw new Error('stack overflow');
      }
      this.values.push(value);
    },
  };
}
