import { assertNever } from "./helpers/assertNever";
import { filterNullish } from "./helpers/filterNullish";
import { unwrap } from "./helpers/unwrap";
import { optimization } from "./optimization";
import type { AstNode } from "./parse";
import { unique } from "./helpers/unique";

function retrieveVariableIndexes(nodes: AstNode[]): number[] {
  return nodes.reduce<number[]>((acc, node) => {
    const makeIndexes = (...nodes: (undefined | AstNode)[]): number[] => {
      return [...acc, ...retrieveVariableIndexes(filterNullish(nodes))];
    };

    switch (node.kind) {
      case "add": {
        return makeIndexes(node.lhs, node.rhs);
      }
      case "sub": {
        return makeIndexes(node.lhs, node.rhs);
      }
      case "mul": {
        return makeIndexes(node.lhs, node.rhs);
      }
      case "div": {
        return makeIndexes(node.lhs, node.rhs);
      }
      case "mod": {
        return makeIndexes(node.lhs, node.rhs);
      }
      case "exp": {
        return makeIndexes(node.lhs, node.rhs);
      }
      case "equ": {
        return makeIndexes(node.lhs, node.rhs);
      }
      case "neq": {
        return makeIndexes(node.lhs, node.rhs);
      }
      case "lss": {
        return makeIndexes(node.lhs, node.rhs);
      }
      case "leq": {
        return makeIndexes(node.lhs, node.rhs);
      }
      case "and": {
        return makeIndexes(node.lhs, node.rhs);
      }
      case "or": {
        return makeIndexes(node.lhs, node.rhs);
      }
      case "not": {
        return makeIndexes(node.operand);
      }
      case "pre-inc": {
        return makeIndexes(node.operand);
      }
      case "pre-dec": {
        return makeIndexes(node.operand);
      }
      case "post-inc": {
        return makeIndexes(node.operand);
      }
      case "post-dec": {
        return makeIndexes(node.operand);
      }
      case "assign": {
        return makeIndexes(node.lhs, node.rhs);
      }
      case "input": {
        return acc;
      }
      case "print": {
        return makeIndexes(node.arg);
      }
      case "putchar": {
        return makeIndexes(node.arg);
      }
      case "if": {
        return makeIndexes(node.cond, node.consequence, node.alternative);
      }
      case "for": {
        return makeIndexes(node.init, node.cond, node.after, node.body);
      }
      case "while": {
        return makeIndexes(node.cond, node.body);
      }
      case "block": {
        return makeIndexes(...node.stmts);
      }
      case "var": {
        return [...acc, node.index];
      }
      case "num": {
        return acc;
      }
      default: {
        assertNever(node);
      }
    }
  }, []);
}

function countVariables(nodes: AstNode[]): number {
  return unique(retrieveVariableIndexes(nodes)).length;
}

type Memory = {
  borrow: () => number;
  free: (value: number) => void;
};

function createMemory(offset: number): Memory {
  const freeIndexes: number[] = [];
  let nextValue = offset;

  return {
    borrow: () => {
      const value = freeIndexes.shift();
      return value ?? nextValue++;
    },
    free: (value) => {
      freeIndexes.unshift(value);
    },
  };
}

export function generateCode(nodes: AstNode[]): string {
  let cur = 0;
  let code = "";

  const variableCount = countVariables(nodes);
  const memory = createMemory(variableCount);

  const emit = (operation: string) => {
    code += operation;
  };

  const focus = (p: number) => {
    while (cur < p) {
      emit(">");
      ++cur;
    }
    while (cur > p) {
      emit("<");
      --cur;
    }
  };

  const loop = (p: number, body: () => void) => {
    focus(p);
    emit("[");
    body();
    emit("]");
    if (cur !== p) {
      throw new Error(
        "compile error: cursor must be the same at the start as at the end",
      );
    }
  };

  const reset = (p: number) => {
    loop(p, () => emit("-"));
  };

  const resetAndFree = (p: number) => {
    if (p < 0) {
      return;
    }

    reset(p);
    memory.free(p);
  };

  const operate = (p: number, operation: string) => {
    focus(p);
    emit(operation);
  };

  const move = (src: number, dst: number) => {
    loop(src, () => {
      operate(dst, "+");
      operate(src, "-");
    });
  };

  const copy = (src: number, dst: number, tmp: number) => {
    loop(src, () => {
      operate(dst, "+");
      operate(tmp, "+");
      operate(src, "-");
    });

    move(tmp, src);
  };

  // generate code and return memory index
  const gen = (node: AstNode): number => {
    switch (node.kind) {
      case "num": {
        const t0 = memory.borrow();
        const t1 = memory.borrow();

        const val = node.val & 0xff; // clamp number from 0 to 255
        const [a, b, tweaker] = unwrap(optimization[val]);

        if (a !== null && b !== null) {
          operate(t1, "+".repeat(a));
          loop(t1, () => {
            operate(t0, "+".repeat(b));
            operate(t1, "-");
          });
        }
        if (tweaker !== null) {
          operate(t0, tweaker);
        }

        memory.free(t1);

        return t0;
      }
      case "input": {
        const arg = memory.borrow();
        operate(arg, ",");
        return arg;
      }
      case "putchar": {
        const arg = gen(node.arg);
        operate(arg, ".");
        resetAndFree(arg);
        return -1;
      }
      case "print": {
        const arg = gen(node.arg);
        const t0 = memory.borrow();
        const t1 = memory.borrow();
        const t2 = memory.borrow();
        const t3 = memory.borrow();
        const t4 = memory.borrow();
        const t5 = memory.borrow();
        const t6 = memory.borrow();

        operate(t0, "+".repeat(10));

        loop(arg, () => {
          operate(arg, "-");
          operate(t0, "-");
          operate(t1, "+");

          copy(t0, t2, t3);

          operate(t3, "+");

          loop(t2, () => {
            operate(t3, "-");
            reset(t2);
          });

          loop(t3, () => {
            move(t1, t0);
            operate(t4, "+");
            operate(t3, "-");
          });

          focus(arg);
        });

        move(t1, t6);
        move(t4, arg);

        reset(t0);
        operate(t0, "+".repeat(10));

        loop(arg, () => {
          operate(arg, "-");
          operate(t0, "-");
          operate(t1, "+");

          copy(t0, t2, t3);

          operate(t3, "+");

          loop(t2, () => {
            operate(t3, "-");
            reset(t2);
          });

          loop(t3, () => {
            move(t1, t0);
            operate(t4, "+");
            operate(t3, "-");
          });

          focus(arg);
        });

        move(t1, t5);

        loop(t4, () => {
          operate(t4, "+".repeat(48));
          operate(t4, ".");
          operate(t3, "+");
          operate(t5, "+");
          reset(t4);
        });

        loop(t5, () => {
          loop(t3, () => {
            operate(t5, "-");
            operate(t3, "-");
          });
          operate(t5, "+".repeat(48));
          operate(t5, ".");
          reset(t5);
        });

        operate(t6, "+".repeat(48));
        operate(t6, ".");
        reset(t6);

        memory.free(t6);
        memory.free(t5);
        memory.free(t4);
        memory.free(t3);
        memory.free(t2);
        memory.free(t1);
        resetAndFree(t0);
        memory.free(arg);

        return -1;
      }
      case "add": {
        const l = gen(node.lhs);
        const r = gen(node.rhs);

        move(r, l);

        memory.free(r);

        return l;
      }
      case "sub": {
        const l = gen(node.lhs);
        const r = gen(node.rhs);

        loop(r, () => {
          operate(l, "-");
          operate(r, "-");
        });

        memory.free(r);

        return l;
      }
      case "mul": {
        const l = gen(node.lhs);
        const r = gen(node.rhs);
        const t0 = memory.borrow();
        const t1 = memory.borrow();

        loop(l, () => {
          copy(r, t0, t1);
          operate(l, "-");
        });

        reset(r);

        move(t0, l);

        memory.free(t1);
        memory.free(t0);
        memory.free(r);

        return l;
      }
      case "mod": {
        const l = gen(node.lhs);
        const r = gen(node.rhs);
        const t0 = memory.borrow();
        const t1 = memory.borrow();
        const t2 = memory.borrow();

        loop(l, () => {
          operate(r, "-");
          operate(t0, "+");

          copy(r, t1, t2);

          operate(t2, "+");

          loop(t1, () => {
            operate(t2, "-");
            reset(t1);
          });

          loop(t2, () => {
            move(t0, r);
            operate(t2, "-");
          });

          operate(l, "-");
        });

        memory.free(t2);
        memory.free(t1);
        resetAndFree(r);
        memory.free(l);

        return t0;
      }
      case "div": {
        const l = gen(node.lhs);
        const r = gen(node.rhs);
        const t0 = memory.borrow();
        const t1 = memory.borrow();
        const t2 = memory.borrow();
        const t3 = memory.borrow();

        move(l, t0);

        loop(t0, () => {
          copy(r, t1, t2);

          loop(t1, () => {
            operate(t2, "+");
            operate(t0, "-");

            loop(t0, () => {
              reset(t2);
              operate(t3, "+");
              operate(t0, "-");
            });

            move(t3, t0);

            loop(t2, () => {
              operate(t1, "-");

              loop(t1, () => {
                operate(l, "-");
                reset(t1);
              });

              operate(t1, "+");
              operate(t2, "-");
            });

            operate(t1, "-");
          });

          operate(l, "+");
          focus(t0);
        });

        memory.free(t3);
        memory.free(t2);
        memory.free(t1);
        memory.free(t0);
        resetAndFree(r);

        return l;
      }
      case "exp": {
        const l = gen(node.lhs);
        const r = gen(node.rhs);
        const t0 = memory.borrow();
        const t1 = memory.borrow();
        const t2 = memory.borrow();

        move(l, t0);

        operate(l, "+");

        loop(r, () => {
          reset(t1);
          reset(t2);

          move(l, t2);

          loop(t2, () => {
            copy(t0, l, t1);
            operate(t2, "-");
          });

          operate(r, "-");
        });

        memory.free(t2);
        memory.free(t1);
        resetAndFree(t0);
        memory.free(r);

        return l;
      }
      case "not": {
        const ope = gen(node.operand);
        const t = memory.borrow();

        operate(t, "+");
        loop(ope, () => {
          operate(t, "-");
          reset(ope);
        });

        memory.free(ope);

        return t;
      }
      case "pre-inc": {
        const o = node.operand.index;
        const t0 = memory.borrow();
        const t1 = memory.borrow();

        operate(o, "+");
        copy(o, t0, t1);

        memory.free(t1);

        return t0;
      }
      case "pre-dec": {
        const o = node.operand.index;
        const t0 = memory.borrow();
        const t1 = memory.borrow();

        operate(o, "-");
        copy(o, t0, t1);

        memory.free(t1);

        return t0;
      }
      case "post-inc": {
        const o = node.operand.index;
        const t0 = memory.borrow();
        const t1 = memory.borrow();

        copy(o, t0, t1);
        operate(o, "+");

        memory.free(t1);

        return t0;
      }
      case "post-dec": {
        const o = node.operand.index;
        const t0 = memory.borrow();
        const t1 = memory.borrow();

        copy(o, t0, t1);
        operate(o, "-");

        memory.free(t1);

        return t0;
      }
      case "equ": {
        const l = gen(node.lhs);
        const r = gen(node.rhs);

        loop(l, () => {
          operate(r, "-");
          operate(l, "-");
        });

        emit("+");

        loop(r, () => {
          operate(l, "-");
          reset(r);
        });

        memory.free(r);

        return l;
      }
      case "neq": {
        const l = gen(node.lhs);
        const r = gen(node.rhs);

        loop(l, () => {
          operate(r, "-");
          operate(l, "-");
        });

        loop(r, () => {
          operate(l, "+");
          reset(r);
        });

        memory.free(r);

        return l;
      }
      case "lss": {
        const l = gen(node.lhs);
        const r = gen(node.rhs);
        const t0 = memory.borrow();
        const t1 = memory.borrow();

        loop(l, () => {
          emit("-");

          copy(r, t0, t1);

          operate(t1, "+");

          loop(t0, () => {
            operate(r, "-");
            operate(t1, "-");
            reset(t0);
          });

          loop(t1, () => {
            reset(l);
            operate(t1, "-");
          });

          focus(l);
        });

        loop(r, () => {
          operate(l, "+");
          reset(r);
        });

        memory.free(t1);
        memory.free(t0);
        memory.free(r);

        return l;
      }
      case "leq": {
        const l = gen(node.lhs);
        const r = gen(node.rhs);
        const t0 = memory.borrow();
        const t1 = memory.borrow();

        loop(r, () => {
          emit("-");

          copy(l, t0, t1);

          operate(t1, "+");

          loop(t0, () => {
            operate(l, "-");
            operate(t1, "-");
            reset(t0);
          });

          loop(t1, () => {
            reset(r);
            operate(t1, "-");
          });

          focus(r);
        });

        emit("+");

        loop(l, () => {
          operate(r, "-");
          reset(l);
        });

        memory.free(t1);
        memory.free(t0);
        memory.free(l);

        return r;
      }
      case "and": {
        const l = gen(node.lhs);
        const r = gen(node.rhs);
        const t = memory.borrow();

        loop(l, () => {
          operate(t, "+");
          reset(l);
        });

        loop(r, () => {
          operate(t, "+");
          reset(r);
        });

        operate(r, "++");

        loop(t, () => {
          operate(r, "-");
          operate(t, "-");
        });

        emit("+");

        loop(r, () => {
          operate(t, "-");
          reset(r);
        });

        memory.free(r);
        memory.free(l);

        return t;
      }
      case "or": {
        const l = gen(node.lhs);
        const r = gen(node.rhs);
        const t = memory.borrow();

        loop(l, () => {
          operate(t, "+");
          reset(l);
        });

        loop(r, () => {
          operate(t, "+");
          reset(r);
        });

        loop(t, () => {
          operate(r, "+");
          reset(t);
        });

        memory.free(l);
        memory.free(t);

        return r;
      }
      case "assign": {
        const l = node.lhs.index;
        const r = gen(node.rhs);
        const t = memory.borrow();

        reset(l);

        loop(r, () => {
          operate(l, "+");
          operate(t, "+");
          operate(r, "-");
        });

        memory.free(r);

        return t;
      }
      case "var": {
        const p = node.index;
        const t0 = memory.borrow();
        const t1 = memory.borrow();

        copy(p, t0, t1);

        memory.free(t1);

        return t0;
      }
      case "if": {
        const cond = gen(node.cond);

        if (node.alternative === undefined) {
          // if
          let rtn = -1;
          loop(cond, () => {
            rtn = gen(node.consequence);
            resetAndFree(cond);
          });

          return rtn;
        }

        // if-else
        const t0 = memory.borrow();
        const t1 = memory.borrow();

        operate(t0, "+");

        loop(cond, () => {
          const t2 = gen(node.consequence);
          if (t2 !== -1) {
            move(t2, t1);
            memory.free(t2);
          }
          operate(t0, "-");
          resetAndFree(cond);
        });

        loop(t0, () => {
          const t2 = gen(node.alternative!);
          if (t2 !== -1) {
            move(t2, t1);
            memory.free(t2);
          }
          operate(t0, "-");
        });

        memory.free(t0);

        return t1;
      }
      case "for": {
        if (node.init !== undefined) {
          resetAndFree(gen(node.init));
        }

        if (node.cond !== undefined) {
          const cond = gen(node.cond);

          loop(cond, () => {
            resetAndFree(gen(node.body));

            if (node.after !== undefined) {
              resetAndFree(gen(node.after));
            }

            reset(cond);
            const t = gen(node.cond!);

            move(t, cond);

            memory.free(t);

            focus(cond);
          });

          memory.free(cond);
        } else {
          const cond = memory.borrow();
          operate(cond, "+");

          loop(cond, () => {
            resetAndFree(gen(node.body));

            if (node.after !== undefined) {
              resetAndFree(gen(node.after));
            }

            focus(cond);
          });

          memory.free(cond);
        }

        return -1;
      }
      case "while": {
        const cond = gen(node.cond);

        loop(cond, () => {
          resetAndFree(gen(node.body));

          reset(cond);
          const t = gen(node.cond!);

          move(t, cond);

          memory.free(t);

          focus(cond);
        });

        memory.free(cond);

        return -1;
      }
      case "block": {
        return node.stmts.reduce((rtn, stmt) => {
          resetAndFree(rtn);
          return gen(stmt);
        }, -1);
      }
    }
  };

  nodes.forEach((node, i) => {
    const t = gen(node);
    if (i !== nodes.length - 1) {
      // on last node, no need to reset and free
      resetAndFree(t);
    }
  });

  return code;
}
