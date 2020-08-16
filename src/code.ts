import { AstNode } from './parse';
import { createStack, MAX_STACK_SIZE } from './stack';

function retrieveReservedIndexes(nodes: AstNode[]): number[] {
  const indexes: number[] = [];

  nodes.forEach((node) => {
    const argNodes: AstNode[] = [];

    if (node.kind === 'assign') {
      indexes.push(node.lhs.index);
    }

    if ('lhs' in node) {
      argNodes.push(node.lhs);
    }
    if ('rhs' in node) {
      argNodes.push(node.rhs);
    }
    if ('arg' in node) {
      argNodes.push(node.arg);
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
        emmit('[');
        operate(l, '+');
        operate(r, '-');
        emmit(']');

        freeIndexes.push(r);

        return l;
      }
      case 'sub': {
        const l = gen(node.lhs);
        const r = gen(node.rhs);

        move(r);
        emmit('[');
        operate(l, '-');
        operate(r, '-');
        emmit(']');

        freeIndexes.push(r);

        return l;
      }
      case 'mul': {
        const l = gen(node.lhs);
        const r = gen(node.rhs);
        const i = freeIndexes.pop();
        const j = freeIndexes.pop();

        move(l);
        emmit('[');
        move(r);
        emmit('[');
        operate(i, '+');
        operate(j, '+');
        operate(r, '-');
        emmit(']');
        move(j);
        emmit('[');
        operate(r, '+');
        operate(j, '-');
        emmit(']');
        operate(l, '-');
        emmit(']');

        operate(r, '[-]');

        move(i);
        emmit('[');
        operate(l, '+');
        operate(i, '-');
        emmit(']');

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
        emmit('[');
        operate(l, '+');
        operate(i, '+');
        operate(r, '-');
        emmit(']');

        freeIndexes.push(r);

        return i;
      }
      case 'var': {
        const v = node.index;
        const i = freeIndexes.pop();
        const j = freeIndexes.pop();

        move(v);
        emmit('[');
        operate(i, '+');
        operate(j, '+');
        operate(v, '-');
        emmit(']');

        move(j);
        emmit('[');
        operate(v, '+');
        operate(j, '-');
        emmit(']');

        freeIndexes.push(j);

        return i;
      }
    }

    throw new Error(`unknown node kind ${node.kind}`);
  };

  nodes.forEach((node, i) => {
    const rtn = gen(node);
    if (i !== nodes.length - 1) {
      operate(rtn, '[-]');
      freeIndexes.push(rtn);
    }
  });

  return code;
}
