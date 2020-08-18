export const MAX_STACK_SIZE = 1024;

export function uniq<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function range(start: number, end: number): number[] {
  return [...Array(end)].map((_, i) => i).slice(start);
}

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
