const maxStepCount = Number.MAX_SAFE_INTEGER;

function unwrap<T>(value: undefined | null | T): T {
  if (value == null) {
    throw new Error("value must not be null or undefined");
  }
  return value;
}

export function run(src: string): string {
  let srcIndex: number = 0;
  let memory: number[] = [0];
  let memoryIndex: number = 0;
  let output: string = "";

  const nextStep = (): boolean => {
    if (srcIndex === src.length) {
      return false;
    }

    switch (src[srcIndex]) {
      case ">": {
        if (memoryIndex === memory.length - 1) {
          memory = [...memory, 0];
        }
        ++memoryIndex;
        ++srcIndex;
        break;
      }
      case "<": {
        if (memoryIndex === 0) {
          memory = [0, ...memory];
        } else {
          --memoryIndex;
        }
        ++srcIndex;
        break;
      }
      case "+": {
        memory[memoryIndex] = (unwrap(memory[memoryIndex]) + 1) % 0xff;
        ++srcIndex;
        break;
      }
      case "-": {
        memory[memoryIndex] = (unwrap(memory[memoryIndex]) - 1) % 0xff;
        ++srcIndex;
        break;
      }
      case ".": {
        output += String.fromCharCode(unwrap(memory[memoryIndex]));
        ++srcIndex;
        break;
      }
      case ",": {
        const value = window.prompt("input a character");

        if (value == null || value === "") {
          memory[memoryIndex] = 0;
        } else {
          memory[memoryIndex] = value.charCodeAt(0);
        }
        ++srcIndex;
        break;
      }
      case "[": {
        if (memory[memoryIndex] !== 0) {
          ++srcIndex;
          break;
        }

        for (let depth = 0; ; ++srcIndex) {
          if (srcIndex === src.length) {
            throw new Error("']' is not found");
          }

          if (src[srcIndex] === "[") {
            ++depth;
          } else if (src[srcIndex] === "]") {
            --depth;

            if (depth === 0) {
              break;
            }
          }
        }
        break;
      }
      case "]": {
        if (memory[memoryIndex] === 0) {
          ++srcIndex;
          break;
        }

        for (let depth = 0; ; --srcIndex) {
          if (srcIndex === 0) {
            throw new Error("'[' is not found");
          }

          if (src[srcIndex] === "]") {
            ++depth;
          } else if (src[srcIndex] === "[") {
            --depth;

            if (depth === 0) {
              break;
            }
          }
        }
        break;
      }
      default: {
        // noop
        break;
      }
    }

    return srcIndex !== src.length;
  };

  for (let steps = 0; nextStep(); ++steps) {
    if (steps > maxStepCount) {
      throw new Error("exceeded max steps");
    }
  }

  return output;
}
