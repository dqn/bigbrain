import { ReservedWord, Token } from './tokenize';
import { createStack, range } from './utils';

const MAX_VARIABLE_COUNT = 512;

export type AstNode =
  | {
      kind:
        | 'add'
        | 'sub'
        | 'mul'
        | 'div'
        | 'mod'
        | 'exp'
        | 'equ'
        | 'neq'
        | 'lss'
        | 'leq'
        | 'and'
        | 'or';
      lhs: AstNode;
      rhs: AstNode;
    }
  | {
      kind: 'not';
      operand: AstNode;
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
      kind: 'input';
    }
  | {
      kind: 'print' | 'putchar';
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
      kind: 'while';
      cond: AstNode;
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

  const next = (): Token => {
    if (!tokens.length) {
      throw Error('there are no tokens');
    }
    return tokens[0];
  };

  const shift = (): Token => {
    if (!tokens.length) {
      throw Error('there are no tokens');
    }
    return tokens.shift()!;
  };

  const consume = (op: ReservedWord): boolean => {
    const token = next();
    if (token.kind !== 'reserved' || token.str !== op) {
      return false;
    }
    tokens.shift();
    return true;
  };

  const expect = (op: ReservedWord): Token => {
    const token = shift();
    if (token.kind !== 'reserved' || token.str !== op) {
      throw new Error(`could not find ${op}`);
    }
    return token;
  };

  const expectKind = <T extends Token['kind']>(kind: T): SpecificToken<T> => {
    const token = shift();
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

    if (next().kind === 'ident') {
      return variable();
    }

    if (consume('input')) {
      expect('(');
      expect(')');
      return { kind: 'input' };
    }

    const token = shift();

    if (token.kind === 'num') {
      return { kind: 'num', val: token.val };
    }

    throw new Error(`invalid token ${token.kind}`);
  };

  const unary = (): AstNode => {
    if (consume('!')) {
      return { kind: 'not', operand: primary() };
    }
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

    if (next().kind === 'ident') {
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

  const exp = (): AstNode => {
    const nodes = [unary()];

    while (consume('**')) {
      nodes.push(unary());
    }

    let node = nodes.pop()!;

    while (nodes.length) {
      node = { kind: 'exp', lhs: nodes.pop()!, rhs: node };
    }

    return node;
  };

  const mulDivMod = (): AstNode => {
    let node = exp();

    while (true) {
      if (consume('*')) {
        node = { kind: 'mul', lhs: node, rhs: exp() };
      } else if (consume('/')) {
        node = { kind: 'div', lhs: node, rhs: exp() };
      } else if (consume('%')) {
        node = { kind: 'mod', lhs: node, rhs: exp() };
      } else {
        return node;
      }
    }
  };

  const addSub = (): AstNode => {
    let node = mulDivMod();

    while (true) {
      if (consume('+')) {
        node = { kind: 'add', lhs: node, rhs: mulDivMod() };
      } else if (consume('-')) {
        node = { kind: 'sub', lhs: node, rhs: mulDivMod() };
      } else {
        return node;
      }
    }
  };

  const relational = (): AstNode => {
    let node = addSub();

    while (true) {
      if (consume('<')) {
        node = { kind: 'lss', lhs: node, rhs: addSub() };
      } else if (consume('<=')) {
        node = { kind: 'leq', lhs: node, rhs: addSub() };
      } else if (consume('>')) {
        node = { kind: 'lss', lhs: addSub(), rhs: node };
      } else if (consume('>=')) {
        node = { kind: 'leq', lhs: addSub(), rhs: node };
      } else {
        return node;
      }
    }
  };

  const equality = (): AstNode => {
    let node = relational();

    while (true) {
      if (consume('==')) {
        node = { kind: 'equ', lhs: node, rhs: relational() };
      } else if (consume('!=')) {
        node = { kind: 'neq', lhs: node, rhs: relational() };
      } else {
        return node;
      }
    }
  };

  const and = (): AstNode => {
    let node = equality();

    while (true) {
      if (consume('&&')) {
        node = { kind: 'and', lhs: node, rhs: equality() };
      } else {
        return node;
      }
    }
  };

  const or = (): AstNode => {
    let node = and();

    while (true) {
      if (consume('||')) {
        node = { kind: 'or', lhs: node, rhs: and() };
      } else {
        return node;
      }
    }
  };

  const assign = (): AstNode => {
    const node = or();

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
    if (consume('putchar')) {
      const arg = expr();
      expect(';');
      return { kind: 'putchar', arg };
    }

    if (consume('print')) {
      const arg = expr();
      expect(';');
      return { kind: 'print', arg };
    }

    if (consume('if')) {
      expect('(');
      const cond = expr();
      expect(')');
      const node: AstNode = { kind: 'if', cond, caseTrue: stmt() };

      if (consume('else')) {
        node.caseFalse = stmt();
      }

      return node;
    }

    if (consume('for')) {
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

    if (consume('while')) {
      expect('(');
      const cond = expr();
      expect(')');

      const whileTrue = stmt();

      return { kind: 'while', cond, whileTrue };
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
    while (next().kind !== 'eof') {
      nodes.push(stmt());
    }
    return nodes;
  };

  return program();
}
