import { AstNode } from './parse';
import { createStack, range, uniq } from './utils';

const FREE_CELL_NUM = 64;

function retrieveReservedIndexes(nodes: AstNode[]): number[] {
  const indexes: number[] = [];

  nodes.forEach((node) => {
    const argNodes: AstNode[] = [];

    if (node.kind === 'var') {
      indexes.push(node.index);
    } else {
      Object.values(node).forEach((value: AstNode[keyof AstNode]) => {
        if (typeof value === 'object') {
          argNodes.push(value);
        }
      });
    }

    indexes.push(...retrieveReservedIndexes(argNodes));
  });

  return uniq(indexes);
}

export function generateCode(nodes: AstNode[]): string {
  let cur = 0;
  let code = '';

  const reservedCount = retrieveReservedIndexes(nodes).length;
  const memory = createStack(range(reservedCount, FREE_CELL_NUM + reservedCount).reverse());

  const emit = (operation: string) => {
    code += operation;
  };

  const focus = (p: number) => {
    while (cur < p) {
      emit('>');
      ++cur;
    }
    while (cur > p) {
      emit('<');
      --cur;
    }
  };

  const loop = (p: number, body: () => void) => {
    focus(p);
    emit('[');
    body();
    emit(']');
    if (cur !== p) {
      throw new Error('compile error: cursor must be the same at the start as at the end');
    }
  };

  const reset = (p: number) => {
    loop(p, () => emit('-'));
  };

  const free = (p: number) => {
    if (p < 0) {
      return;
    }

    reset(p);
    memory.push(p);
  };

  const operate = (p: number, operation: string) => {
    focus(p);
    emit(operation);
  };

  const copy = (src: number, dst: number, tmp: number) => {
    loop(src, () => {
      operate(dst, '+');
      operate(tmp, '+');
      operate(src, '-');
    });

    loop(tmp, () => {
      operate(src, '+');
      operate(tmp, '-');
    });
  };

  const gen = (node: AstNode): number => {
    switch (node.kind) {
      case 'num': {
        const t0 = memory.pop();
        const t1 = memory.pop();

        const mul = (a: number, b: number) => {
          operate(t1, '+'.repeat(a));
          loop(t1, () => {
            operate(t0, '+'.repeat(b));
            operate(t1, '-');
          });
        };

        // clamp to 0-255
        const val = node.val & 0xff;

        switch (val) {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
          case 8:
          case 9:
          case 10:
          case 11:
          case 12:
          case 13:
          case 14:
          case 15: {
            operate(t0, '+'.repeat(val));
            break;
          }
          case 16: {
            mul(4, 4);
            break;
          }
          case 17: {
            mul(4, 4);
            operate(t0, '+');
            break;
          }
          case 18: {
            mul(3, 6);
            break;
          }
          case 19: {
            mul(3, 6);
            operate(t0, '+');
            break;
          }
          case 20: {
            mul(4, 5);
            break;
          }
          case 21: {
            mul(3, 7);
            break;
          }
          case 22: {
            mul(3, 7);
            operate(t0, '+');
            break;
          }
          case 23: {
            mul(4, 6);
            operate(t0, '-');
            break;
          }
          case 24: {
            mul(4, 6);
            break;
          }
          case 25: {
            mul(5, 5);
            break;
          }
          case 26: {
            mul(5, 5);
            operate(t0, '+');
            break;
          }
          case 27: {
            mul(3, 9);
            break;
          }
          case 28: {
            mul(4, 7);
            break;
          }
          case 29: {
            mul(4, 7);
            operate(t0, '+');
            break;
          }
          case 30: {
            mul(5, 6);
            break;
          }
          case 31: {
            mul(5, 6);
            operate(t0, '+');
            break;
          }
          case 32: {
            mul(4, 8);
            break;
          }
          case 33: {
            mul(4, 8);
            operate(t0, '+');
            break;
          }
          case 34: {
            mul(5, 7);
            operate(t0, '-');
            break;
          }
          case 35: {
            mul(5, 7);
            break;
          }
          case 36: {
            mul(6, 6);
            break;
          }
          case 37: {
            mul(6, 6);
            operate(t0, '+');
            break;
          }
          case 38: {
            mul(6, 6);
            operate(t0, '++');
            break;
          }
          case 39: {
            mul(5, 8);
            operate(t0, '-');
            break;
          }
          case 40: {
            mul(5, 8);
            break;
          }
          case 41: {
            mul(5, 8);
            operate(t0, '+');
            break;
          }
          case 42: {
            mul(6, 7);
            break;
          }
          case 43: {
            mul(6, 7);
            operate(t0, '+');
            break;
          }
          case 44: {
            mul(4, 11);
            break;
          }
          case 45: {
            mul(5, 9);
            break;
          }
          case 46: {
            mul(5, 9);
            operate(t0, '+');
            break;
          }
          case 47: {
            mul(6, 8);
            operate(t0, '-');
            break;
          }
          case 48: {
            mul(6, 8);
            break;
          }
          case 49: {
            mul(7, 7);
            break;
          }
          case 50: {
            mul(5, 10);
            break;
          }
          case 51: {
            mul(5, 10);
            operate(t0, '+');
            break;
          }
          case 52: {
            mul(4, 13);
            break;
          }
          case 53: {
            mul(4, 13);
            operate(t0, '+');
            break;
          }
          case 54: {
            mul(6, 9);
            break;
          }
          case 55: {
            mul(5, 11);
            break;
          }
          case 56: {
            mul(7, 8);
            break;
          }
          case 57: {
            mul(7, 8);
            operate(t0, '+');
            break;
          }
          case 58: {
            mul(7, 8);
            operate(t0, '++');
            break;
          }
          case 59: {
            mul(6, 10);
            operate(t0, '-');
            break;
          }
          case 60: {
            mul(6, 10);
            break;
          }
          case 61: {
            mul(6, 10);
            operate(t0, '+');
            break;
          }
          case 62: {
            mul(7, 9);
            operate(t0, '-');
            break;
          }
          case 63: {
            mul(7, 9);
            break;
          }
          case 64: {
            mul(8, 8);
            break;
          }
          case 65: {
            mul(8, 8);
            operate(t0, '+');
            break;
          }
          case 66: {
            mul(6, 11);
            break;
          }
          case 67: {
            mul(6, 11);
            operate(t0, '+');
            break;
          }
          case 68: {
            mul(6, 11);
            operate(t0, '++');
            break;
          }
          case 69: {
            mul(7, 10);
            operate(t0, '-');
            break;
          }
          case 70: {
            mul(7, 10);
            break;
          }
          case 71: {
            mul(7, 10);
            operate(t0, '+');
            break;
          }
          case 72: {
            mul(8, 9);
            break;
          }
          case 73: {
            mul(8, 9);
            operate(t0, '+');
            break;
          }
          case 74: {
            mul(8, 9);
            operate(t0, '++');
            break;
          }
          case 75: {
            mul(5, 15);
            break;
          }
          case 76: {
            mul(5, 15);
            operate(t0, '+');
            break;
          }
          case 77: {
            mul(7, 11);
            break;
          }
          case 78: {
            mul(6, 13);
            break;
          }
          case 79: {
            mul(6, 13);
            operate(t0, '+');
            break;
          }
          case 80: {
            mul(8, 10);
            break;
          }
          case 81: {
            mul(9, 9);
            break;
          }
          case 82: {
            mul(9, 9);
            operate(t0, '+');
            break;
          }
          case 83: {
            mul(7, 12);
            operate(t0, '-');
            break;
          }
          case 84: {
            mul(7, 12);
            break;
          }
          case 85: {
            mul(7, 12);
            operate(t0, '+');
            break;
          }
          case 86: {
            mul(7, 12);
            operate(t0, '++');
            break;
          }
          case 87: {
            mul(8, 11);
            operate(t0, '-');
            break;
          }
          case 88: {
            mul(8, 11);
            break;
          }
          case 89: {
            mul(8, 11);
            operate(t0, '+');
            break;
          }
          case 90: {
            mul(9, 10);
            break;
          }
          case 91: {
            mul(7, 13);
            break;
          }
          case 92: {
            mul(7, 13);
            operate(t0, '+');
            break;
          }
          case 93: {
            mul(7, 13);
            operate(t0, '++');
            break;
          }
          case 94: {
            mul(5, 19);
            operate(t0, '-');
            break;
          }
          case 95: {
            mul(5, 19);
            break;
          }
          case 96: {
            mul(8, 12);
            break;
          }
          case 97: {
            mul(8, 12);
            operate(t0, '+');
            break;
          }
          case 98: {
            mul(7, 14);
            break;
          }
          case 99: {
            mul(9, 11);
            break;
          }
          case 100: {
            mul(10, 10);
            break;
          }
          case 101: {
            mul(10, 10);
            operate(t0, '+');
            break;
          }
          case 102: {
            mul(10, 10);
            operate(t0, '++');
            break;
          }
          case 103: {
            mul(8, 13);
            operate(t0, '-');
            break;
          }
          case 104: {
            mul(8, 13);
            break;
          }
          case 105: {
            mul(7, 15);
            break;
          }
          case 106: {
            mul(7, 15);
            operate(t0, '+');
            break;
          }
          case 107: {
            mul(9, 12);
            operate(t0, '-');
            break;
          }
          case 108: {
            mul(9, 12);
            break;
          }
          case 109: {
            mul(9, 12);
            operate(t0, '+');
            break;
          }
          case 110: {
            mul(10, 11);
            break;
          }
          case 111: {
            mul(10, 11);
            operate(t0, '+');
            break;
          }
          case 112: {
            mul(8, 14);
            break;
          }
          case 113: {
            mul(8, 14);
            operate(t0, '+');
            break;
          }
          case 114: {
            mul(8, 14);
            operate(t0, '++');
            break;
          }
          case 115: {
            mul(9, 13);
            operate(t0, '--');
            break;
          }
          case 116: {
            mul(9, 13);
            operate(t0, '-');
            break;
          }
          case 117: {
            mul(9, 13);
            break;
          }
          case 118: {
            mul(9, 13);
            operate(t0, '+');
            break;
          }
          case 119: {
            mul(7, 17);
            break;
          }
          case 120: {
            mul(10, 12);
            break;
          }
          case 121: {
            mul(11, 11);
            break;
          }
          case 122: {
            mul(11, 11);
            operate(t0, '+');
            break;
          }
          case 123: {
            mul(11, 11);
            operate(t0, '++');
            break;
          }
          case 124: {
            mul(9, 14);
            operate(t0, '--');
            break;
          }
          case 125: {
            mul(9, 14);
            operate(t0, '-');
            break;
          }
          case 126: {
            mul(9, 14);
            break;
          }
          case 127: {
            mul(9, 14);
            operate(t0, '+');
            break;
          }
          case 128: {
            mul(8, 16);
            break;
          }
          case 129: {
            mul(8, 16);
            operate(t0, '+');
            break;
          }
          case 130: {
            mul(10, 13);
            break;
          }
          case 131: {
            mul(10, 13);
            operate(t0, '+');
            break;
          }
          case 132: {
            mul(11, 12);
            break;
          }
          case 133: {
            mul(11, 12);
            operate(t0, '+');
            break;
          }
          case 134: {
            mul(9, 15);
            operate(t0, '-');
            break;
          }
          case 135: {
            mul(9, 15);
            break;
          }
          case 136: {
            mul(8, 17);
            break;
          }
          case 137: {
            mul(8, 17);
            operate(t0, '+');
            break;
          }
          case 138: {
            mul(8, 17);
            operate(t0, '++');
            break;
          }
          case 139: {
            mul(10, 14);
            operate(t0, '-');
            break;
          }
          case 140: {
            mul(10, 14);
            break;
          }
          case 141: {
            mul(10, 14);
            operate(t0, '+');
            break;
          }
          case 142: {
            mul(11, 13);
            operate(t0, '-');
            break;
          }
          case 143: {
            mul(11, 13);
            break;
          }
          case 144: {
            mul(12, 12);
            break;
          }
          case 145: {
            mul(12, 12);
            operate(t0, '+');
            break;
          }
          case 146: {
            mul(12, 12);
            operate(t0, '++');
            break;
          }
          case 147: {
            mul(12, 12);
            operate(t0, '+++');
            break;
          }
          case 148: {
            mul(10, 15);
            operate(t0, '--');
            break;
          }
          case 149: {
            mul(10, 15);
            operate(t0, '-');
            break;
          }
          case 150: {
            mul(10, 15);
            break;
          }
          case 151: {
            mul(10, 15);
            operate(t0, '+');
            break;
          }
          case 152: {
            mul(8, 19);
            break;
          }
          case 153: {
            mul(9, 17);
            break;
          }
          case 154: {
            mul(11, 14);
            break;
          }
          case 155: {
            mul(11, 14);
            operate(t0, '+');
            break;
          }
          case 156: {
            mul(12, 13);
            break;
          }
          case 157: {
            mul(12, 13);
            operate(t0, '+');
            break;
          }
          case 158: {
            mul(12, 13);
            operate(t0, '++');
            break;
          }
          case 159: {
            mul(10, 16);
            operate(t0, '-');
            break;
          }
          case 160: {
            mul(10, 16);
            break;
          }
          case 161: {
            mul(10, 16);
            operate(t0, '+');
            break;
          }
          case 162: {
            mul(9, 18);
            break;
          }
          case 163: {
            mul(9, 18);
            operate(t0, '+');
            break;
          }
          case 164: {
            mul(11, 15);
            operate(t0, '-');
            break;
          }
          case 165: {
            mul(11, 15);
            break;
          }
          case 166: {
            mul(11, 15);
            operate(t0, '+');
            break;
          }
          case 167: {
            mul(12, 14);
            operate(t0, '-');
            break;
          }
          case 168: {
            mul(12, 14);
            break;
          }
          case 169: {
            mul(13, 13);
            break;
          }
          case 170: {
            mul(10, 17);
            break;
          }
          case 171: {
            mul(9, 19);
            break;
          }
          case 172: {
            mul(9, 19);
            operate(t0, '+');
            break;
          }
          case 173: {
            mul(9, 19);
            operate(t0, '++');
            break;
          }
          case 174: {
            mul(7, 25);
            operate(t0, '-');
            break;
          }
          case 175: {
            mul(7, 25);
            break;
          }
          case 176: {
            mul(11, 16);
            break;
          }
          case 177: {
            mul(11, 16);
            operate(t0, '+');
            break;
          }
          case 178: {
            mul(11, 16);
            operate(t0, '++');
            break;
          }
          case 179: {
            mul(12, 15);
            operate(t0, '-');
            break;
          }
          case 180: {
            mul(12, 15);
            break;
          }
          case 181: {
            mul(12, 15);
            operate(t0, '+');
            break;
          }
          case 182: {
            mul(13, 14);
            break;
          }
          case 183: {
            mul(13, 14);
            operate(t0, '+');
            break;
          }
          case 184: {
            mul(13, 14);
            operate(t0, '++');
            break;
          }
          case 185: {
            mul(11, 17);
            operate(t0, '--');
            break;
          }
          case 186: {
            mul(11, 17);
            operate(t0, '-');
            break;
          }
          case 187: {
            mul(11, 17);
            break;
          }
          case 188: {
            mul(11, 17);
            operate(t0, '+');
            break;
          }
          case 189: {
            mul(9, 21);
            break;
          }
          case 190: {
            mul(10, 19);
            break;
          }
          case 191: {
            mul(10, 19);
            operate(t0, '+');
            break;
          }
          case 192: {
            mul(12, 16);
            break;
          }
          case 193: {
            mul(12, 16);
            operate(t0, '+');
            break;
          }
          case 194: {
            mul(13, 15);
            operate(t0, '-');
            break;
          }
          case 195: {
            mul(13, 15);
            break;
          }
          case 196: {
            mul(14, 14);
            break;
          }
          case 197: {
            mul(14, 14);
            operate(t0, '+');
            break;
          }
          case 198: {
            mul(11, 18);
            break;
          }
          case 199: {
            mul(11, 18);
            operate(t0, '+');
            break;
          }
          case 200: {
            mul(10, 20);
            break;
          }
          case 201: {
            mul(10, 20);
            operate(t0, '+');
            break;
          }
          case 202: {
            mul(12, 17);
            operate(t0, '--');
            break;
          }
          case 203: {
            mul(12, 17);
            operate(t0, '-');
            break;
          }
          case 204: {
            mul(12, 17);
            break;
          }
          case 205: {
            mul(12, 17);
            operate(t0, '+');
            break;
          }
          case 206: {
            mul(12, 17);
            operate(t0, '++');
            break;
          }
          case 207: {
            mul(9, 23);
            break;
          }
          case 208: {
            mul(13, 16);
            break;
          }
          case 209: {
            mul(11, 19);
            break;
          }
          case 210: {
            mul(14, 15);
            break;
          }
          case 211: {
            mul(14, 15);
            operate(t0, '+');
            break;
          }
          case 212: {
            mul(14, 15);
            operate(t0, '++');
            break;
          }
          case 213: {
            mul(14, 15);
            operate(t0, '++');
            break;
          }
          case 214: {
            mul(12, 18);
            operate(t0, '--');
            break;
          }
          case 215: {
            mul(12, 18);
            operate(t0, '-');
            break;
          }
          case 216: {
            mul(12, 18);
            break;
          }
          case 217: {
            mul(12, 18);
            operate(t0, '+');
            break;
          }
          case 218: {
            mul(12, 18);
            operate(t0, '++');
            break;
          }
          case 219: {
            mul(11, 20);
            operate(t0, '-');
            break;
          }
          case 220: {
            mul(11, 20);
            break;
          }
          case 221: {
            mul(13, 17);
            break;
          }
          case 222: {
            mul(13, 17);
            operate(t0, '+');
            break;
          }
          case 223: {
            mul(14, 16);
            operate(t0, '-');
            break;
          }
          case 224: {
            mul(14, 16);
            break;
          }
          case 225: {
            mul(15, 15);
            break;
          }
          case 226: {
            mul(15, 15);
            operate(t0, '+');
            break;
          }
          case 227: {
            mul(12, 19);
            operate(t0, '-');
            break;
          }
          case 228: {
            mul(12, 19);
            break;
          }
          case 229: {
            mul(12, 19);
            operate(t0, '+');
            break;
          }
          case 230: {
            mul(10, 23);
            break;
          }
          case 231: {
            mul(11, 21);
            break;
          }
          case 232: {
            mul(11, 21);
            operate(t0, '+');
            break;
          }
          case 233: {
            mul(13, 18);
            operate(t0, '-');
            break;
          }
          case 234: {
            mul(13, 18);
            break;
          }
          case 235: {
            mul(13, 18);
            operate(t0, '+');
            break;
          }
          case 236: {
            mul(13, 18);
            operate(t0, '++');
            break;
          }
          case 237: {
            mul(14, 17);
            operate(t0, '-');
            break;
          }
          case 238: {
            mul(14, 17);
            break;
          }
          case 239: {
            mul(14, 17);
            operate(t0, '+');
            break;
          }
          case 240: {
            mul(15, 16);
            break;
          }
          case 241: {
            mul(15, 16);
            operate(t0, '+');
            break;
          }
          case 242: {
            mul(11, 22);
            break;
          }
          case 243: {
            mul(11, 22);
            operate(t0, '+');
            break;
          }
          case 244: {
            mul(11, 22);
            operate(t0, '++');
            break;
          }
          case 245: {
            mul(13, 19);
            operate(t0, '--');
            break;
          }
          case 246: {
            mul(13, 19);
            operate(t0, '-');
            break;
          }
          case 247: {
            mul(13, 19);
            break;
          }
          case 248: {
            mul(13, 19);
            operate(t0, '+');
            break;
          }
          case 249: {
            mul(13, 19);
            operate(t0, '++');
            break;
          }
          case 250: {
            mul(10, 25);
            break;
          }
          case 251: {
            mul(10, 25);
            operate(t0, '+');
            break;
          }
          case 252: {
            mul(14, 18);
            break;
          }
          case 253: {
            mul(14, 18);
            operate(t0, '+');
            break;
          }
          case 254: {
            mul(15, 17);
            operate(t0, '-');
            break;
          }
          case 255: {
            mul(15, 17);
            break;
          }
        }

        memory.push(t1);

        return t0;
      }
      case 'input': {
        const arg = memory.pop();
        operate(arg, ',');
        return arg;
      }
      case 'putchar': {
        const arg = gen(node.arg);
        operate(arg, '.');
        free(arg);
        return -1;
      }
      case 'print': {
        const arg = gen(node.arg);
        const t0 = memory.pop();
        const t1 = memory.pop();
        const t2 = memory.pop();
        const t3 = memory.pop();
        const t4 = memory.pop();
        const t5 = memory.pop();
        const t6 = memory.pop();

        operate(t0, '+'.repeat(10));

        loop(arg, () => {
          operate(arg, '-');
          operate(t0, '-');
          operate(t1, '+');

          copy(t0, t2, t3);

          operate(t3, '+');

          loop(t2, () => {
            operate(t3, '-');
            reset(t2);
          });

          loop(t3, () => {
            loop(t1, () => {
              operate(t0, '+');
              operate(t1, '-');
            });
            operate(t4, '+');
            operate(t3, '-');
          });

          focus(arg);
        });

        loop(t1, () => {
          operate(t6, '+');
          operate(t1, '-');
        });

        loop(t4, () => {
          operate(arg, '+');
          operate(t4, '-');
        });

        reset(t0);
        operate(t0, '+'.repeat(10));

        loop(arg, () => {
          operate(arg, '-');
          operate(t0, '-');
          operate(t1, '+');

          copy(t0, t2, t3);

          operate(t3, '+');

          loop(t2, () => {
            operate(t3, '-');
            reset(t2);
          });

          loop(t3, () => {
            loop(t1, () => {
              operate(t0, '+');
              operate(t1, '-');
            });
            operate(t4, '+');
            operate(t3, '-');
          });

          focus(arg);
        });

        loop(t1, () => {
          operate(t5, '+');
          operate(t1, '-');
        });

        loop(t4, () => {
          operate(t4, '+'.repeat(48));
          operate(t4, '.');
          operate(t3, '+');
          operate(t5, '+');
          reset(t4);
        });

        loop(t5, () => {
          loop(t3, () => {
            operate(t5, '-');
            operate(t3, '-');
          });
          operate(t5, '+'.repeat(48));
          operate(t5, '.');
          reset(t5);
        });

        operate(t6, '+'.repeat(48));
        operate(t6, '.');
        reset(t6);

        memory.push(t6);
        memory.push(t5);
        memory.push(t4);
        memory.push(t3);
        memory.push(t2);
        memory.push(t1);
        free(t0);
        memory.push(arg);

        return -1;
      }
      case 'add': {
        const l = gen(node.lhs);
        const r = gen(node.rhs);

        loop(r, () => {
          operate(l, '+');
          operate(r, '-');
        });

        memory.push(r);

        return l;
      }
      case 'sub': {
        const l = gen(node.lhs);
        const r = gen(node.rhs);

        loop(r, () => {
          operate(l, '-');
          operate(r, '-');
        });

        memory.push(r);

        return l;
      }
      case 'mul': {
        const l = gen(node.lhs);
        const r = gen(node.rhs);
        const t0 = memory.pop();
        const t1 = memory.pop();

        loop(l, () => {
          copy(r, t0, t1);
          operate(l, '-');
        });

        reset(r);

        loop(t0, () => {
          operate(l, '+');
          operate(t0, '-');
        });

        memory.push(t1);
        memory.push(t0);
        memory.push(r);

        return l;
      }
      case 'mod': {
        const l = gen(node.lhs);
        const r = gen(node.rhs);
        const t0 = memory.pop();
        const t1 = memory.pop();
        const t2 = memory.pop();

        loop(l, () => {
          operate(r, '-');
          operate(t0, '+');

          copy(r, t1, t2);

          operate(t2, '+');

          loop(t1, () => {
            operate(t2, '-');
            reset(t1);
          });

          loop(t2, () => {
            loop(t0, () => {
              operate(r, '+');
              operate(t0, '-');
            });
            operate(t2, '-');
          });

          operate(l, '-');
        });

        memory.push(t2);
        memory.push(t1);
        free(r);
        memory.push(l);

        return t0;
      }
      case 'div': {
        const l = gen(node.lhs);
        const r = gen(node.rhs);
        const t0 = memory.pop();
        const t1 = memory.pop();
        const t2 = memory.pop();
        const t3 = memory.pop();

        loop(l, () => {
          operate(t0, '+');
          operate(l, '-');
        });

        loop(t0, () => {
          copy(r, t1, t2);

          loop(t1, () => {
            operate(t2, '+');
            operate(t0, '-');

            loop(t0, () => {
              reset(t2);
              operate(t3, '+');
              operate(t0, '-');
            });

            loop(t3, () => {
              operate(t0, '+');
              operate(t3, '-');
            });

            loop(t2, () => {
              operate(t1, '-');

              loop(t1, () => {
                operate(l, '-');
                reset(t1);
              });

              operate(t1, '+');
              operate(t2, '-');
            });

            operate(t1, '-');
          });

          operate(l, '+');
          focus(t0);
        });

        memory.push(t3);
        memory.push(t2);
        memory.push(t1);
        memory.push(t0);
        free(r);

        return l;
      }
      case 'exp': {
        const l = gen(node.lhs);
        const r = gen(node.rhs);
        const t0 = memory.pop();
        const t1 = memory.pop();
        const t2 = memory.pop();

        loop(l, () => {
          operate(t0, '+');
          operate(l, '-');
        });

        operate(l, '+');

        loop(r, () => {
          reset(t1);
          reset(t2);

          loop(l, () => {
            operate(t2, '+');
            operate(l, '-');
          });

          loop(t2, () => {
            copy(t0, l, t1);
            operate(t2, '-');
          });

          operate(r, '-');
        });

        memory.push(t2);
        memory.push(t1);
        free(t0);
        memory.push(r);

        return l;
      }
      case 'not': {
        const ope = gen(node.operand);
        const t = memory.pop();

        operate(t, '+');
        loop(ope, () => {
          operate(t, '-');
          reset(ope);
        });

        memory.push(ope);

        return t;
      }
      case 'pre-inc': {
        const o = node.operand.index;
        const t0 = memory.pop();
        const t1 = memory.pop();

        operate(o, '+');
        copy(o, t0, t1);

        memory.push(t1);

        return t0;
      }
      case 'pre-dec': {
        const o = node.operand.index;
        const t0 = memory.pop();
        const t1 = memory.pop();

        operate(o, '-');
        copy(o, t0, t1);

        memory.push(t1);

        return t0;
      }
      case 'post-inc': {
        const o = node.operand.index;
        const t0 = memory.pop();
        const t1 = memory.pop();

        copy(o, t0, t1);
        operate(o, '+');

        memory.push(t1);

        return t0;
      }
      case 'post-dec': {
        const o = node.operand.index;
        const t0 = memory.pop();
        const t1 = memory.pop();

        copy(o, t0, t1);
        operate(o, '-');

        memory.push(t1);

        return t0;
      }
      case 'equ': {
        const l = gen(node.lhs);
        const r = gen(node.rhs);

        loop(l, () => {
          operate(r, '-');
          operate(l, '-');
        });

        emit('+');

        loop(r, () => {
          operate(l, '-');
          reset(r);
        });

        memory.push(r);

        return l;
      }
      case 'neq': {
        const l = gen(node.lhs);
        const r = gen(node.rhs);

        loop(l, () => {
          operate(r, '-');
          operate(l, '-');
        });

        loop(r, () => {
          operate(l, '+');
          reset(r);
        });

        memory.push(r);

        return l;
      }
      case 'lss': {
        const l = gen(node.lhs);
        const r = gen(node.rhs);
        const t0 = memory.pop();
        const t1 = memory.pop();

        loop(l, () => {
          emit('-');

          copy(r, t0, t1);

          operate(t1, '+');

          loop(t0, () => {
            operate(r, '-');
            operate(t1, '-');
            reset(t0);
          });

          loop(t1, () => {
            reset(l);
            operate(t1, '-');
          });

          focus(l);
        });

        loop(r, () => {
          operate(l, '+');
          reset(r);
        });

        memory.push(t1);
        memory.push(t0);
        memory.push(r);

        return l;
      }
      case 'leq': {
        const l = gen(node.lhs);
        const r = gen(node.rhs);
        const t0 = memory.pop();
        const t1 = memory.pop();

        loop(r, () => {
          emit('-');

          copy(l, t0, t1);

          operate(t1, '+');

          loop(t0, () => {
            operate(l, '-');
            operate(t1, '-');
            reset(t0);
          });

          loop(t1, () => {
            reset(r);
            operate(t1, '-');
          });

          focus(r);
        });

        emit('+');

        loop(l, () => {
          operate(r, '-');
          reset(l);
        });

        memory.push(t1);
        memory.push(t0);
        memory.push(l);

        return r;
      }
      case 'and': {
        const l = gen(node.lhs);
        const r = gen(node.rhs);
        const t = memory.pop();

        loop(l, () => {
          operate(t, '+');
          reset(l);
        });

        loop(r, () => {
          operate(t, '+');
          reset(r);
        });

        operate(r, '++');

        loop(t, () => {
          operate(r, '-');
          operate(t, '-');
        });

        emit('+');

        loop(r, () => {
          operate(t, '-');
          reset(r);
        });

        memory.push(r);
        memory.push(l);

        return t;
      }
      case 'or': {
        const l = gen(node.lhs);
        const r = gen(node.rhs);
        const t = memory.pop();

        loop(l, () => {
          operate(t, '+');
          reset(l);
        });

        loop(r, () => {
          operate(t, '+');
          reset(r);
        });

        loop(t, () => {
          operate(r, '+');
          reset(t);
        });

        memory.push(l);
        memory.push(t);

        return r;
      }
      case 'assign': {
        const l = node.lhs.index;
        const r = gen(node.rhs);
        const t = memory.pop();

        reset(l);

        loop(r, () => {
          operate(l, '+');
          operate(t, '+');
          operate(r, '-');
        });

        memory.push(r);

        return t;
      }
      case 'var': {
        const p = node.index;
        const t0 = memory.pop();
        const t1 = memory.pop();

        copy(p, t0, t1);

        memory.push(t1);

        return t0;
      }
      case 'if': {
        const cond = gen(node.cond);

        if (!node.caseFalse) {
          loop(cond, () => {
            free(gen(node.caseTrue));
            free(cond);
          });
        } else {
          const t = memory.pop();
          operate(t, '+');

          loop(cond, () => {
            free(gen(node.caseTrue));

            operate(t, '-');
            free(cond);
          });

          loop(t, () => {
            free(gen(node.caseFalse!));
            operate(t, '-');
          });

          memory.push(t);
        }

        return -1;
      }
      case 'for': {
        if (node.init) {
          free(gen(node.init));
        }

        if (node.cond) {
          const cond = gen(node.cond);

          loop(cond, () => {
            free(gen(node.whileTrue));

            if (node.after) {
              free(gen(node.after));
            }

            reset(cond);
            const t = gen(node.cond!);

            loop(t, () => {
              operate(cond, '+');
              operate(t, '-');
            });

            memory.push(t);

            focus(cond);
          });

          memory.push(cond);
        } else {
          const cond = memory.pop();
          operate(cond, '+');

          loop(cond, () => {
            free(gen(node.whileTrue));

            if (node.after) {
              free(gen(node.after));
            }

            focus(cond);
          });

          memory.push(cond);
        }

        return -1;
      }
      case 'while': {
        const cond = gen(node.cond);

        loop(cond, () => {
          free(gen(node.whileTrue));

          reset(cond);
          const t = gen(node.cond!);

          loop(t, () => {
            operate(cond, '+');
            operate(t, '-');
          });

          memory.push(t);

          focus(cond);
        });

        memory.push(cond);

        return -1;
      }
      case 'block': {
        node.stmts.forEach((stmt) => {
          free(gen(stmt));
        });

        return -1;
      }
    }
  };

  nodes.forEach((node, i) => {
    const t = gen(node);
    if (i !== nodes.length - 1) {
      free(t);
    }
  });

  return code;
}
