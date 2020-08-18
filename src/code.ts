import { emit } from 'process';

import { AstNode } from './parse';
import { createStack, MAX_STACK_SIZE } from './stack';

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

  return indexes;
}

export function generateCode(nodes: AstNode[]): string {
  let cur = 0;
  let code = '';
  const reservedIndexes = retrieveReservedIndexes(nodes);
  const freeIndexes = createStack(
    [...Array(MAX_STACK_SIZE)]
      .map((_, i) => i)
      .filter((i) => !reservedIndexes.includes(i))
      .reverse(),
  );

  const emmit = (operation: string) => {
    code += operation;
  };

  const move = (i: number) => {
    while (cur < i) {
      emmit('>');
      ++cur;
    }
    while (cur > i) {
      emmit('<');
      --cur;
    }
  };

  const loop = (func: () => void) => {
    const start = cur;
    emmit('[');
    func();
    emmit(']');
    if (cur !== start) {
      throw new Error('compile error: cursor must be the same at the start as at the end');
    }
  };

  const free = (i: number) => {
    move(i);
    loop(() => emmit('-'));
    freeIndexes.push(i);
  };

  const operate = (i: number, operation: string) => {
    move(i);
    emmit(operation);
  };

  const gen = (node: AstNode): number => {
    switch (node.kind) {
      case 'num': {
        const i = freeIndexes.pop();

        move(i);
        for (let i = 0; i < node.val; ++i) {
          emmit('+');
        }

        return i;
      }
      case 'print': {
        const i = gen(node.arg);
        move(i);
        emmit('.');
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

        freeIndexes.push(r);

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

        freeIndexes.push(r);

        return l;
      }
      case 'mul': {
        const l = gen(node.lhs);
        const r = gen(node.rhs);
        const i = freeIndexes.pop();
        const j = freeIndexes.pop();

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

        move(r);
        loop(() => emmit('-'));

        move(i);
        loop(() => {
          operate(l, '+');
          operate(i, '-');
        });

        freeIndexes.push(j);
        freeIndexes.push(i);
        freeIndexes.push(r);

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
        emmit('+');

        move(r);
        loop(() => {
          operate(l, '-');
          move(r);
          loop(() => emmit('-'));
        });

        freeIndexes.push(r);

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
          move(r);
          loop(() => emmit('-'));
        });

        freeIndexes.push(r);

        return l;
      }
      case 'lss': {
        const l = gen(node.lhs);
        const r = gen(node.rhs);
        const i = freeIndexes.pop();
        const j = freeIndexes.pop();

        move(l);
        loop(() => {
          emmit('-');

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
            move(i);
            loop(() => emmit('-'));
          });

          move(j);
          loop(() => {
            move(l);
            loop(() => emmit('-'));
            operate(j, '-');
          });

          move(l);
        });

        move(r);
        loop(() => {
          operate(l, '+');
          move(r);
          loop(() => emmit('-'));
        });

        freeIndexes.push(j);
        freeIndexes.push(i);
        freeIndexes.push(r);

        return l;
      }
      case 'assign': {
        const l = node.lhs.index;
        const r = gen(node.rhs);
        const i = freeIndexes.pop();

        operate(l, '[-]');

        move(r);
        loop(() => {
          operate(l, '+');
          operate(i, '+');
          operate(r, '-');
        });

        freeIndexes.push(r);

        return i;
      }
      case 'var': {
        const v = node.index;
        const i = freeIndexes.pop();
        const j = freeIndexes.pop();

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

        freeIndexes.push(j);

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
          const i = freeIndexes.pop();
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

            move(cond);
            loop(() => emmit('-'));

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
          const cond = freeIndexes.pop();
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
