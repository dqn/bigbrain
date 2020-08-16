import { createStack, MAX_STACK_SIZE } from './stack';
import { Token } from './tokenize';

export type AstNode =
  | {
      kind: 'add' | 'sub' | 'mul' | 'div';
      lhs: AstNode;
      rhs: AstNode;
    }
  | {
      kind: 'assign';
      lhs: SpecificAstNode<'var'>;
      rhs: AstNode;
    }
  | {
      kind: 'print';
      arg: AstNode;
    }
  | {
      kind: 'if';
      cond: AstNode;
      caseTrue: AstNode;
      caseFalse?: AstNode;
    }
  | {
      kind: 'var';
      index: number;
    }
  | {
      kind: 'num';
      val: number;
    };

type VariableMap = {
  [name: string]: { index: number };
};

type SpecificToken<T extends Token['kind']> = Extract<Token, { kind: T }>;

type SpecificAstNode<T extends AstNode['kind']> = Extract<AstNode, { kind: T }>;

export function parse(tokens: Token[]) {
  const globalVariables: VariableMap = {};
  const indexStack = createStack([...Array(MAX_STACK_SIZE)].map((_, i) => i).reverse());

  const nextToken = (): Token => {
    if (!tokens.length) {
      throw Error('there are no tokens');
    }
    return tokens[0];
  };

  const shiftToken = (): Token => {
    if (!tokens.length) {
      throw Error('there are no tokens');
    }
    return tokens.shift()!;
  };

  const consume = (op: string): boolean => {
    const token = nextToken();
    if (token.kind !== 'reserved' || token.str !== op) {
      return false;
    }
    tokens.shift();
    return true;
  };

  const consumeKind = (kind: Token['kind']): boolean => {
    if (nextToken().kind !== kind) {
      return false;
    }
    tokens.shift();
    return true;
  };

  const expect = (op: string): Token => {
    const token = shiftToken();
    if (token.kind !== 'reserved' || token.str !== op) {
      throw new Error(`could not find ${op}`);
    }
    return token;
  };

  const expectKind = <T extends Token['kind']>(kind: T): SpecificToken<T> => {
    const token = shiftToken();
    if (token.kind !== kind) {
      throw new Error(`expected ${kind}`);
    }
    return token as SpecificToken<T>;
  };

  const primary = (): AstNode => {
    if (consume('(')) {
      const node = expr();
      consume(')');
      return node;
    }

    const token = shiftToken();

    if (token.kind === 'ident') {
      const { str: name } = token;
      if (!globalVariables[name]) {
        globalVariables[name] = { index: indexStack.pop() };
      }
      return { kind: 'var', index: globalVariables[name].index };
    }

    if (token.kind === 'num') {
      return { kind: 'num', val: token.val };
    }

    throw new Error(`invalid token ${token.kind}`);
  };

  const unary = (): AstNode => {
    if (consume('+')) {
      return primary();
    }
    if (consume('-')) {
      return { kind: 'sub', lhs: { kind: 'num', val: 0 }, rhs: primary() };
    }
    return primary();
  };

  const mul = (): AstNode => {
    let node = unary();

    while (true) {
      if (consume('*')) {
        node = { kind: 'mul', lhs: node, rhs: unary() };
      } else if (consume('/')) {
        node = { kind: 'div', lhs: node, rhs: unary() };
      } else {
        return node;
      }
    }
  };

  const add = (): AstNode => {
    let node = mul();

    while (true) {
      if (consume('+')) {
        node = { kind: 'add', lhs: node, rhs: mul() };
      } else if (consume('-')) {
        node = { kind: 'sub', lhs: node, rhs: mul() };
      } else {
        return node;
      }
    }
  };

  const assign = (): AstNode => {
    const node = add();

    if (consume('=')) {
      if (node.kind !== 'var') {
        throw new Error('cannot assign to a value that is not a variable');
      }
      return { kind: 'assign', lhs: node, rhs: assign() };
    } else {
      return node;
    }
  };

  const expr = (): AstNode => {
    return assign();
  };

  const stmt = (): AstNode => {
    if (consumeKind('print')) {
      const arg = expr();
      expect(';');
      return { kind: 'print', arg };
    }

    if (consumeKind('if')) {
      expect('(');
      const cond = expr();
      expect(')');
      const node: AstNode = { kind: 'if', cond, caseTrue: stmt() };

      if (consumeKind('else')) {
        node.caseFalse = stmt();
      }

      return node;
    }

    const node = expr();
    expect(';');
    return node;
  };

  const program = (): AstNode[] => {
    const nodes: AstNode[] = [];
    while (nextToken().kind !== 'eof') {
      nodes.push(stmt());
    }
    return nodes;
  };

  return program();
}
