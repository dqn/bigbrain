import { unwrap } from "./helpers/unwrap";
import type { ReservedWord, Token } from "./tokenize";

type BinaryOperator = {
  kind:
    | "add"
    | "sub"
    | "mul"
    | "div"
    | "mod"
    | "exp"
    | "equ"
    | "neq"
    | "lss"
    | "leq"
    | "and"
    | "or";
  lhs: AstNode;
  rhs: AstNode;
};

type Not = {
  kind: "not";
  operand: AstNode;
};

type PreInc = {
  kind: "pre-inc";
  operand: Var;
};

type PreDec = {
  kind: "pre-dec";
  operand: Var;
};

type PostInc = {
  kind: "post-inc";
  operand: Var;
};

type PostDec = {
  kind: "post-dec";
  operand: Var;
};

type Assign = {
  kind: "assign";
  lhs: Var;
  rhs: AstNode;
};

type Input = {
  kind: "input";
};

type Print = {
  kind: "print";
  arg: AstNode;
};

type Putchar = {
  kind: "putchar";
  arg: AstNode;
};

type If = {
  kind: "if";
  cond: AstNode;
  consequence: Block;
  alternative?: Block | If;
};

type For = {
  kind: "for";
  init?: AstNode;
  cond?: AstNode;
  after?: AstNode;
  body: Block;
};

type While = {
  kind: "while";
  cond: AstNode;
  body: AstNode;
};

type Block = {
  kind: "block";
  stmts: AstNode[];
};

type Var = {
  kind: "var";
  index: number;
};

type Num = {
  kind: "num";
  val: number;
};

export type AstNode =
  | BinaryOperator
  | Not
  | PreInc
  | PreDec
  | PostInc
  | PostDec
  | Assign
  | Input
  | Print
  | Putchar
  | If
  | For
  | While
  | Block
  | Var
  | Num;

type SpecificToken<T extends Token["kind"]> = Extract<Token, { kind: T }>;

export function parse(tokens: Token[]): AstNode[] {
  const globalVariables = new Map<string, { index: number }>();

  const next = (): Token => {
    const token = tokens[0];
    if (token === undefined) {
      throw new Error("there are no tokens");
    }
    return token;
  };

  const shift = (): Token => {
    const token = next();
    tokens.shift();
    return token;
  };

  const isNextWord = (word: ReservedWord): boolean => {
    const token = next();
    return token.kind === "reserved" && token.str === word;
  };

  const isNextKind = (kind: Token["kind"]): boolean => {
    return next().kind === kind;
  };

  const consume = (word: ReservedWord): boolean => {
    return isNextWord(word) && (shift(), true);
  };

  const expect = (word: ReservedWord): Token => {
    if (!isNextWord(word)) {
      throw new Error(`could not find '${word}'`);
    }
    return shift();
  };

  const expectKind = <T extends Token["kind"]>(kind: T): SpecificToken<T> => {
    const token = shift();
    if (token.kind !== kind) {
      throw new Error(`expected '${kind}', but got '${token.kind}'`);
    }
    return token as SpecificToken<T>;
  };

  const variable = (): Var => {
    const { str } = expectKind("ident");

    const variable = globalVariables.get(str) ?? {
      index: globalVariables.size,
    };
    globalVariables.set(str, variable);

    return {
      kind: "var",
      index: variable.index,
    };
  };

  const primary = (): AstNode => {
    if (consume("(")) {
      const node = expr();
      expect(")");
      return node;
    }

    if (isNextWord("{")) {
      return block();
    }

    if (consume("if")) {
      expect("(");
      const cond = expr();
      expect(")");

      const node: If = {
        kind: "if",
        cond,
        consequence: block(),
      };

      if (consume("else")) {
        if (isNextWord("if")) {
          const next = primary();
          if (next.kind !== "if") {
            throw new Error("expected 'if");
          }
          node.alternative = next;
        } else {
          node.alternative = block();
        }
      }

      return node;
    }

    if (isNextKind("ident")) {
      return variable();
    }

    if (consume("input")) {
      expect("(");
      expect(")");
      return {
        kind: "input",
      };
    }

    const token = shift();
    if (token.kind === "num") {
      return {
        kind: "num",
        val: token.val,
      };
    }

    throw new Error(`invalid token '${token.kind}'`);
  };

  const unary = (): AstNode => {
    if (consume("!")) {
      return { kind: "not", operand: primary() };
    }
    if (consume("+")) {
      return primary();
    }
    if (consume("-")) {
      return {
        kind: "sub",
        lhs: { kind: "num", val: 0 },
        rhs: primary(),
      };
    }
    if (consume("++")) {
      return { kind: "pre-inc", operand: variable() };
    }
    if (consume("--")) {
      return { kind: "pre-dec", operand: variable() };
    }
    if (isNextKind("ident")) {
      const v = variable();

      if (consume("++")) {
        return { kind: "post-inc", operand: v };
      }
      if (consume("--")) {
        return { kind: "post-dec", operand: v };
      }

      return v;
    }

    return primary();
  };

  const exp = (): AstNode => {
    const nodes = [unary()];

    while (consume("**")) {
      nodes.push(unary());
    }

    let node = unwrap(nodes.pop());

    while (nodes.length !== 0) {
      node = { kind: "exp", lhs: unwrap(nodes.pop()), rhs: node };
    }

    return node;
  };

  const term = (): AstNode => {
    let node = exp();

    while (true) {
      if (consume("*")) {
        node = { kind: "mul", lhs: node, rhs: exp() };
      } else if (consume("/")) {
        node = { kind: "div", lhs: node, rhs: exp() };
      } else if (consume("%")) {
        node = { kind: "mod", lhs: node, rhs: exp() };
      } else {
        return node;
      }
    }
  };

  const addSub = (): AstNode => {
    let node = term();

    while (true) {
      if (consume("+")) {
        node = { kind: "add", lhs: node, rhs: term() };
      } else if (consume("-")) {
        node = { kind: "sub", lhs: node, rhs: term() };
      } else {
        return node;
      }
    }
  };

  const relational = (): AstNode => {
    let node = addSub();

    while (true) {
      if (consume("<")) {
        node = { kind: "lss", lhs: node, rhs: addSub() };
      } else if (consume("<=")) {
        node = { kind: "leq", lhs: node, rhs: addSub() };
      } else if (consume(">")) {
        node = { kind: "lss", lhs: addSub(), rhs: node };
      } else if (consume(">=")) {
        node = { kind: "leq", lhs: addSub(), rhs: node };
      } else {
        return node;
      }
    }
  };

  const equality = (): AstNode => {
    let node = relational();

    while (true) {
      if (consume("==")) {
        node = { kind: "equ", lhs: node, rhs: relational() };
      } else if (consume("!=")) {
        node = { kind: "neq", lhs: node, rhs: relational() };
      } else {
        return node;
      }
    }
  };

  const and = (): AstNode => {
    let node = equality();

    while (consume("&&")) {
      node = { kind: "and", lhs: node, rhs: equality() };
    }
    return node;
  };

  const or = (): AstNode => {
    let node = and();

    while (consume("||")) {
      node = { kind: "or", lhs: node, rhs: and() };
    }
    return node;
  };

  const assign = (): AstNode => {
    const node = or();

    if (consume("=")) {
      if (node.kind !== "var") {
        throw new Error("cannot assign to a value that is not a variable");
      }
      return {
        kind: "assign",
        lhs: node,
        rhs: assign(),
      };
    }

    return node;
  };

  const expr = (): AstNode => {
    return assign();
  };

  const stmt = (): AstNode => {
    if (consume("putchar")) {
      const arg = expr();
      expect(";");
      return { kind: "putchar", arg };
    }

    if (consume("print")) {
      const arg = expr();
      expect(";");
      return { kind: "print", arg };
    }

    if (consume("for")) {
      const node: Omit<For, "body"> = { kind: "for" };

      expect("(");
      if (!consume(";")) {
        node.init = expr();
        expect(";");
      }
      if (!consume(";")) {
        node.cond = expr();
        expect(";");
      }
      if (!consume(")")) {
        node.after = expr();
        expect(")");
      }

      return {
        ...node,
        body: block(),
      };
    }

    if (consume("while")) {
      expect("(");
      const cond = expr();
      expect(")");

      return {
        kind: "while",
        cond,
        body: stmt(),
      };
    }

    if (isNextWord("if")) {
      return expr();
    }

    const node = expr();
    expect(";");

    return node;
  };

  const block = (): Block => {
    const stmts: Block["stmts"] = [];

    expect("{");
    while (!consume("}")) {
      stmts.push(stmt());
    }

    return {
      kind: "block",
      stmts,
    };
  };

  const program = (): AstNode[] => {
    const nodes: AstNode[] = [];
    while (!isNextKind("eof")) {
      nodes.push(stmt());
    }
    return nodes;
  };

  return program();
}
