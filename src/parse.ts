import { Token } from './tokenize';
import { createStack, range } from './utils';

const MAX_VARIABLE_COUNT = 512;

export type AstNode =
  | {
      kind: 'add' | 'sub' | 'mul' | 'div' | 'equ' | 'neq' | 'lss' | 'leq';
      lhs: AstNode;
      rhs: AstNode;
    }
  | {
      kind: 'pre-inc' | 'pre-dec' | 'post-inc' | 'post-dec';
      operand: SpecificAstNode<'var'>;
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
      kind: 'for';
      init?: AstNode;
      cond?: AstNode;
      after?: AstNode;
      whileTrue: AstNode;
    }
  | {
      kind: 'block';
      stmts: AstNode[];
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
  const indexStack = createStack(range(0, MAX_VARIABLE_COUNT).reverse());

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

  const variable = (): SpecificAstNode<'var'> => {
    const token = expectKind('ident');

    const { str: name } = token;

    if (!globalVariables[name]) {
      globalVariables[name] = { index: indexStack.pop() };
    }

    return { kind: 'var', index: globalVariables[name].index };
  };

  const primary = (): AstNode => {
    if (consume('(')) {
      const node = expr();
      consume(')');
      return node;
    }

    if (nextToken().kind === 'ident') {
      return variable();
    }

    const token = shiftToken();

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
    if (consume('++')) {
      return { kind: 'pre-inc', operand: variable() };
    }
    if (consume('--')) {
      return { kind: 'pre-dec', operand: variable() };
    }

    if (nextToken().kind === 'ident') {
      const v = variable();

      if (consume('++')) {
        return { kind: 'post-inc', operand: v };
      }
      if (consume('--')) {
        return { kind: 'post-dec', operand: v };
      }

      return v;
    }

    const node = primary();

    return node;
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

  const relational = (): AstNode => {
    let node = add();

    while (true) {
      if (consume('<')) {
        node = { kind: 'lss', lhs: node, rhs: add() };
      } else if (consume('<=')) {
        node = { kind: 'leq', lhs: node, rhs: add() };
      } else if (consume('>')) {
        node = { kind: 'lss', lhs: add(), rhs: node };
      } else if (consume('>=')) {
        node = { kind: 'leq', lhs: add(), rhs: node };
      } else {
        return node;
      }
    }
  };

  const equality = (): AstNode => {
    let node = relational();

    while (true) {
      if (consume('==')) {
        node = { kind: 'equ', lhs: node, rhs: add() };
      } else if (consume('!=')) {
        node = { kind: 'neq', lhs: node, rhs: add() };
      } else {
        return node;
      }
    }
  };

  const assign = (): AstNode => {
    const node = equality();

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

    if (consumeKind('for')) {
      const node: AstNode = { kind: 'for', whileTrue: null! };

      expect('(');
      if (!consume(';')) {
        node.init = expr();
        expect(';');
      }
      if (!consume(';')) {
        node.cond = expr();
        expect(';');
      }
      if (!consume(')')) {
        node.after = expr();
        expect(')');
      }

      node.whileTrue = stmt();

      return node;
    }

    if (consume('{')) {
      const stmts: AstNode[] = [];
      while (!consume('}')) {
        stmts.push(stmt());
      }
      return { kind: 'block', stmts };
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
