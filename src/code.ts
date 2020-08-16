import { AstNode } from './parse';
import { createStack, MAX_STACK_SIZE } from './stack';

function retrieveReservedIndexes(nodes: AstNode[]): number[] {
  const indexes: number[] = [];

  nodes.forEach((node) => {
    const argNodes: AstNode[] = [];

    if (node.kind === 'assign') {
      if (node.lhs.kind !== 'var') {
        throw new Error('cannot assign to anything other than a variable');
      }
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

  const move = (i: number) => {
    while (cur < i) {
      code += '>';
      ++cur;
    }
    while (cur > i) {
      code += '<';
      --cur;
    }
  };

  const operate = (i: number, operation: string) => {
    move(i);
    code += operation;
  };

  const gen = (node: AstNode): number => {
    switch (node.kind) {
      case 'num': {
        const i = freeIndexes.pop();

        move(i);
        for (let i = 0; i < node.val; ++i) {
          code += '+';
        }

        return i;
      }
      case 'print': {
        const i = gen(node.arg);
        move(i);
        code += '.';
        return i;
      }
      case 'add': {
        const l = gen(node.lhs);
        const r = gen(node.rhs);

        move(r);
        code += '[';
        operate(l, '+');
        operate(r, '-');
        code += ']';

        freeIndexes.push(r);

        return l;
      }
      case 'sub': {
        const l = gen(node.lhs);
        const r = gen(node.rhs);

        move(r);
        code += '[';
        operate(l, '-');
        operate(r, '-');
        code += ']';

        freeIndexes.push(r);

        return l;
      }
      case 'mul': {
        const l = gen(node.lhs);
        const r = gen(node.rhs);
        const i = freeIndexes.pop();
        const j = freeIndexes.pop();

        move(l);
        code += '[';
        move(r);
        code += '[';
        operate(i, '+');
        operate(j, '+');
        operate(r, '-');
        code += ']';
        move(j);
        code += '[';
        operate(r, '+');
        operate(j, '-');
        code += ']';
        operate(l, '-');
        code += ']';

        operate(r, '[-]');

        move(i);
        code += '[';
        operate(l, '+');
        operate(i, '-');
        code += ']';

        freeIndexes.push(j);
        freeIndexes.push(i);
        freeIndexes.push(r);

        return l;
      }
    }

    throw new Error(`unknown node kind ${node.kind}`);
  };

  nodes.forEach(gen);

  return code;
}
