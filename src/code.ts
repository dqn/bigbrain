import { numFactors } from './num';
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

  const move = (src: number, dst: number) => {
    loop(src, () => {
      operate(dst, '+');
      operate(src, '-');
    });
  };

  const copy = (src: number, dst: number, tmp: number) => {
    loop(src, () => {
      operate(dst, '+');
      operate(tmp, '+');
      operate(src, '-');
    });

    move(tmp, src);
  };

  const gen = (node: AstNode): number => {
    switch (node.kind) {
      case 'num': {
        const t0 = memory.pop();
        const t1 = memory.pop();

        // clamp to 0-255
        const val = node.val & 0xff;
        const [a, b, tweaker] = numFactors[val];

        if (a && b) {
          operate(t1, '+'.repeat(a));
          loop(t1, () => {
            operate(t0, '+'.repeat(b));
            operate(t1, '-');
          });
        }
        if (tweaker) {
          operate(t0, tweaker);
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
            move(t1, t0);
            operate(t4, '+');
            operate(t3, '-');
          });

          focus(arg);
        });

        move(t1, t6);
        move(t4, arg);

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
            move(t1, t0);
            operate(t4, '+');
            operate(t3, '-');
          });

          focus(arg);
        });

        move(t1, t5);

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

        move(r, l);

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

        move(t0, l);

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
            move(t0, r);
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

        move(l, t0);

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

            move(t3, t0);

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

        move(l, t0);

        operate(l, '+');

        loop(r, () => {
          reset(t1);
          reset(t2);

          move(l, t2);

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

        if (!node.alternative) {
          // if (only)
          let rtn = -1;
          loop(cond, () => {
            rtn = gen(node.consequence);
            free(cond);
          });

          return rtn;
        }

        // if-else
        const t0 = memory.pop();
        const t1 = memory.pop();

        operate(t0, '+');

        loop(cond, () => {
          const t2 = gen(node.consequence);
          if (t2 !== -1) {
            move(t2, t1);
            memory.push(t2);
          }
          operate(t0, '-');
          free(cond);
        });

        loop(t0, () => {
          const t2 = gen(node.alternative!);
          if (t2 !== -1) {
            move(t2, t1);
            memory.push(t2);
          }
          operate(t0, '-');
        });

        memory.push(t0);

        return t1;
      }
      case 'for': {
        if (node.init) {
          free(gen(node.init));
        }

        if (node.cond) {
          const cond = gen(node.cond);

          loop(cond, () => {
            free(gen(node.body));

            if (node.after) {
              free(gen(node.after));
            }

            reset(cond);
            const t = gen(node.cond!);

            move(t, cond);

            memory.push(t);

            focus(cond);
          });

          memory.push(cond);
        } else {
          const cond = memory.pop();
          operate(cond, '+');

          loop(cond, () => {
            free(gen(node.body));

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
          free(gen(node.body));

          reset(cond);
          const t = gen(node.cond!);

          move(t, cond);

          memory.push(t);

          focus(cond);
        });

        memory.push(cond);

        return -1;
      }
      case 'block': {
        let rtn = -1;

        node.stmts.forEach((stmt) => {
          if (stmt.kind !== 'rtn') {
            free(gen(stmt));
          } else {
            rtn = gen(stmt.expr);
          }
        });

        return rtn;
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
