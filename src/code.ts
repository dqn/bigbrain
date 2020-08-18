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

  const move = (i: number) => {
    while (cur < i) {
      emit('>');
      ++cur;
    }
    while (cur > i) {
      emit('<');
      --cur;
    }
  };

  const loop = (func: () => void) => {
    const start = cur;
    emit('[');
    func();
    emit(']');
    if (cur !== start) {
      throw new Error('compile error: cursor must be the same at the start as at the end');
    }
  };

  const reset = (i: number) => {
    move(i);
    loop(() => emit('-'));
  };

  const free = (i: number) => {
    reset(i);
    memory.push(i);
  };

  const operate = (i: number, operation: string) => {
    move(i);
    emit(operation);
  };

  const gen = (node: AstNode): number => {
    switch (node.kind) {
      case 'num': {
        const i = memory.pop();

        move(i);
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

        move(r);
        loop(() => {
          operate(l, '+');
          operate(r, '-');
        });

        memory.push(r);

        return l;
      }
      case 'sub': {
        const l = gen(node.lhs);
        const r = gen(node.rhs);

        move(r);
        loop(() => {
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

        move(l);
        loop(() => {
          move(r);
          loop(() => {
            operate(i, '+');
            operate(j, '+');
            operate(r, '-');
          });

          move(j);
          loop(() => {
            operate(r, '+');
            operate(j, '-');
          });

          operate(l, '-');
        });

        reset(r);

        move(i);
        loop(() => {
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

        move(l);
        loop(() => {
          operate(r, '-');
          operate(l, '-');
        });

        emit('+');

        move(r);
        loop(() => {
          operate(l, '-');
          reset(r);
        });

        memory.push(r);

        return l;
      }
      case 'neq': {
        const l = gen(node.lhs);
        const r = gen(node.rhs);

        move(l);
        loop(() => {
          operate(r, '-');
          operate(l, '-');
        });

        move(r);
        loop(() => {
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

        move(l);
        loop(() => {
          emit('-');

          move(l);
          loop(() => {
            operate(i, '+');
            operate(j, '+');
            operate(l, '-');
          });

          move(j);
          loop(() => {
            operate(l, '+');
            operate(j, '-');
          });

          operate(j, '+');

          move(i);
          loop(() => {
            operate(r, '-');
            operate(j, '-');
            reset(i);
          });

          move(j);
          loop(() => {
            reset(l);
            operate(j, '-');
          });

          move(l);
        });

        move(r);
        loop(() => {
          operate(l, '+');
          reset(r);
        });

        memory.push(j);
        memory.push(i);
        memory.push(r);

        return l;
      }
      case 'assign': {
        const l = node.lhs.index;
        const r = gen(node.rhs);
        const i = memory.pop();

        move(l);
        loop(() => emit('-'));

        move(r);
        loop(() => {
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

        move(v);
        loop(() => {
          operate(i, '+');
          operate(j, '+');
          operate(v, '-');
        });

        move(j);
        loop(() => {
          operate(v, '+');
          operate(j, '-');
        });

        memory.push(j);

        return i;
      }
      case 'if': {
        const c = gen(node.cond);

        if (!node.caseFalse) {
          move(c);
          loop(() => {
            const rtn = gen(node.caseTrue);

            free(rtn);
            free(c);
          });
        } else {
          const i = memory.pop();
          operate(i, '+');

          move(c);
          loop(() => {
            const rtn = gen(node.caseTrue);

            free(rtn);

            operate(i, '-');
            free(c);
          });

          move(i);
          loop(() => {
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

          move(cond);
          loop(() => {
            free(gen(node.whileTrue));

            if (node.after) {
              free(gen(node.after));
            }

            reset(cond);

            const rtn = gen(node.cond!);

            move(rtn);
            loop(() => {
              operate(cond, '+');
              operate(rtn, '-');
            });

            move(cond);
          });

          free(cond);
        } else {
          const cond = memory.pop();
          operate(cond, '+');

          move(cond);
          loop(() => {
            free(gen(node.whileTrue));

            if (node.after) {
              free(gen(node.after));
            }

            move(cond);
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
