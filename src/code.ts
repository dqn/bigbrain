import { AstNode } from './parse';
import { createStack, range, uniq } from './utils';

const FREE_CELL_NUM = 10;

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

  const focus = (i: number) => {
    while (cur < i) {
      emit('>');
      ++cur;
    }
    while (cur > i) {
      emit('<');
      --cur;
    }
  };

  const loop = (i: number, body: () => void) => {
    focus(i);
    emit('[');
    body();
    emit(']');
    if (cur !== i) {
      throw new Error('compile error: cursor must be the same at the start as at the end');
    }
  };

  const reset = (i: number) => {
    loop(i, () => emit('-'));
  };

  const free = (i: number) => {
    reset(i);
    memory.push(i);
  };

  const operate = (i: number, operation: string) => {
    focus(i);
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
        const i = memory.pop();

        focus(i);
        for (let i = 0; i < node.val; ++i) {
          emit('+');
        }

        return i;
      }
      case 'print': {
        const i = gen(node.arg);
        operate(i, '.');
        return i;
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
        const i = memory.pop();
        const j = memory.pop();

        loop(l, () => {
          copy(r, i, j);
          operate(l, '-');
        });

        reset(r);

        loop(i, () => {
          operate(l, '+');
          operate(i, '-');
        });

        memory.push(j);
        memory.push(i);
        memory.push(r);

        return l;
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
        const i = memory.pop();
        const j = memory.pop();

        loop(l, () => {
          emit('-');

          copy(r, i, j);

          operate(j, '+');

          loop(i, () => {
            operate(r, '-');
            operate(j, '-');
            reset(i);
          });

          loop(j, () => {
            reset(l);
            operate(j, '-');
          });

          focus(l);
        });

        loop(r, () => {
          operate(l, '+');
          reset(r);
        });

        memory.push(j);
        memory.push(i);
        memory.push(r);

        return l;
      }
      case 'leq': {
        const l = gen(node.lhs);
        const r = gen(node.rhs);
        const i = memory.pop();
        const j = memory.pop();

        loop(r, () => {
          emit('-');

          copy(l, i, j);

          operate(j, '+');

          loop(i, () => {
            operate(l, '-');
            operate(j, '-');
            reset(i);
          });

          loop(j, () => {
            reset(r);
            operate(j, '-');
          });

          focus(r);
        });

        emit('+');

        loop(l, () => {
          operate(r, '-');
          reset(l);
        });

        memory.push(j);
        memory.push(i);
        memory.push(l);

        return r;
      }
      case 'assign': {
        const l = node.lhs.index;
        const r = gen(node.rhs);
        const i = memory.pop();

        loop(l, () => emit('-'));

        loop(r, () => {
          operate(l, '+');
          operate(i, '+');
          operate(r, '-');
        });

        memory.push(r);

        return i;
      }
      case 'var': {
        const v = node.index;
        const i = memory.pop();
        const j = memory.pop();

        copy(v, i, j);

        memory.push(j);

        return i;
      }
      case 'if': {
        const c = gen(node.cond);

        if (!node.caseFalse) {
          loop(c, () => {
            const rtn = gen(node.caseTrue);

            free(rtn);
            free(c);
          });
        } else {
          const i = memory.pop();
          operate(i, '+');

          loop(c, () => {
            const rtn = gen(node.caseTrue);

            free(rtn);

            operate(i, '-');
            free(c);
          });

          loop(i, () => {
            const rtn = gen(node.caseFalse!);

            free(rtn);
            operate(i, '-');
          });
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

            const rtn = gen(node.cond!);

            loop(rtn, () => {
              operate(cond, '+');
              operate(rtn, '-');
            });

            focus(cond);
          });

          free(cond);
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

          free(cond);
        }

        return -1;
      }
    }

    throw new Error(`unknown node kind ${node.kind}`);
  };

  nodes.forEach((node, i) => {
    const rtn = gen(node);
    if (i !== nodes.length - 1) {
      free(rtn);
    }
  });

  return code;
}
