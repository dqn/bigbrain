import { AstNode, parse } from "../parse";
import type { Token } from "../tokenize";

describe("parse", () => {
  it("add", () => {
    const tokens: Token[] = [
      { kind: "num", val: 2 },
      { kind: "reserved", str: "+" },
      { kind: "num", val: 3 },
      { kind: "reserved", str: "+" },
      { kind: "num", val: 42 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "add",
        lhs: {
          kind: "add",
          lhs: {
            kind: "num",
            val: 2,
          },
          rhs: {
            kind: "num",
            val: 3,
          },
        },
        rhs: {
          kind: "num",
          val: 42,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("sub", () => {
    const tokens: Token[] = [
      { kind: "num", val: 10 },
      { kind: "reserved", str: "-" },
      { kind: "num", val: 2 },
      { kind: "reserved", str: "-" },
      { kind: "num", val: 1 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "sub",
        lhs: {
          kind: "sub",
          lhs: {
            kind: "num",
            val: 10,
          },
          rhs: {
            kind: "num",
            val: 2,
          },
        },
        rhs: {
          kind: "num",
          val: 1,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("mul", () => {
    const tokens: Token[] = [
      { kind: "num", val: 5 },
      { kind: "reserved", str: "*" },
      { kind: "num", val: 8 },
      { kind: "reserved", str: "*" },
      { kind: "num", val: 10 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "mul",
        lhs: {
          kind: "mul",
          lhs: {
            kind: "num",
            val: 5,
          },
          rhs: {
            kind: "num",
            val: 8,
          },
        },
        rhs: {
          kind: "num",
          val: 10,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("div", () => {
    const tokens: Token[] = [
      { kind: "num", val: 6 },
      { kind: "reserved", str: "/" },
      { kind: "num", val: 2 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "div",
        lhs: {
          kind: "num",
          val: 6,
        },
        rhs: {
          kind: "num",
          val: 2,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("mod", () => {
    const tokens: Token[] = [
      { kind: "num", val: 5 },
      { kind: "reserved", str: "%" },
      { kind: "num", val: 2 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "mod",
        lhs: {
          kind: "num",
          val: 5,
        },
        rhs: {
          kind: "num",
          val: 2,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("exp", () => {
    const tokens: Token[] = [
      { kind: "num", val: 2 },
      { kind: "reserved", str: "**" },
      { kind: "num", val: 1 },
      { kind: "reserved", str: "**" },
      { kind: "num", val: 2 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "exp",
        lhs: {
          kind: "num",
          val: 2,
        },
        rhs: {
          kind: "exp",
          lhs: {
            kind: "num",
            val: 1,
          },
          rhs: {
            kind: "num",
            val: 2,
          },
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("not", () => {
    const tokens: Token[] = [
      { kind: "reserved", str: "!" },
      { kind: "num", val: 2 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "not",
        operand: {
          kind: "num",
          val: 2,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("pre-inc", () => {
    const tokens: Token[] = [
      { kind: "ident", str: "x" },
      { kind: "reserved", str: "=" },
      { kind: "num", val: 1 },
      { kind: "reserved", str: ";" },
      { kind: "reserved", str: "++" },
      { kind: "ident", str: "x" },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "assign",
        lhs: {
          kind: "var",
          index: 0,
        },
        rhs: {
          kind: "num",
          val: 1,
        },
      },
      {
        kind: "pre-inc",
        operand: {
          kind: "var",
          index: 0,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("pre-dec", () => {
    const tokens: Token[] = [
      { kind: "ident", str: "x" },
      { kind: "reserved", str: "=" },
      { kind: "num", val: 1 },
      { kind: "reserved", str: ";" },
      { kind: "reserved", str: "--" },
      { kind: "ident", str: "x" },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "assign",
        lhs: {
          kind: "var",
          index: 0,
        },
        rhs: {
          kind: "num",
          val: 1,
        },
      },
      {
        kind: "pre-dec",
        operand: {
          kind: "var",
          index: 0,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("post-inc", () => {
    const tokens: Token[] = [
      { kind: "ident", str: "x" },
      { kind: "reserved", str: "=" },
      { kind: "num", val: 1 },
      { kind: "reserved", str: ";" },
      { kind: "ident", str: "x" },
      { kind: "reserved", str: "++" },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "assign",
        lhs: {
          kind: "var",
          index: 0,
        },
        rhs: {
          kind: "num",
          val: 1,
        },
      },
      {
        kind: "post-inc",
        operand: {
          kind: "var",
          index: 0,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("post-dec", () => {
    const tokens: Token[] = [
      { kind: "ident", str: "x" },
      { kind: "reserved", str: "=" },
      { kind: "num", val: 1 },
      { kind: "reserved", str: ";" },
      { kind: "ident", str: "x" },
      { kind: "reserved", str: "--" },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "assign",
        lhs: {
          kind: "var",
          index: 0,
        },
        rhs: {
          kind: "num",
          val: 1,
        },
      },
      {
        kind: "post-dec",
        operand: {
          kind: "var",
          index: 0,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("parences", () => {
    const tokens: Token[] = [
      { kind: "num", val: 4 },
      { kind: "reserved", str: "*" },
      { kind: "reserved", str: "(" },
      { kind: "num", val: 11 },
      { kind: "reserved", str: "+" },
      { kind: "num", val: 6 },
      { kind: "reserved", str: ")" },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "mul",
        lhs: {
          kind: "num",
          val: 4,
        },
        rhs: {
          kind: "add",
          lhs: {
            kind: "num",
            val: 11,
          },
          rhs: {
            kind: "num",
            val: 6,
          },
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("equ", () => {
    const tokens: Token[] = [
      { kind: "num", val: 1 },
      { kind: "reserved", str: "==" },
      { kind: "num", val: 3 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "equ",
        lhs: {
          kind: "num",
          val: 1,
        },
        rhs: {
          kind: "num",
          val: 3,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("neq", () => {
    const tokens: Token[] = [
      { kind: "num", val: 1 },
      { kind: "reserved", str: "!=" },
      { kind: "num", val: 3 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "neq",
        lhs: {
          kind: "num",
          val: 1,
        },
        rhs: {
          kind: "num",
          val: 3,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("lss", () => {
    const tokens: Token[] = [
      { kind: "num", val: 1 },
      { kind: "reserved", str: "<" },
      { kind: "num", val: 3 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "lss",
        lhs: {
          kind: "num",
          val: 1,
        },
        rhs: {
          kind: "num",
          val: 3,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("gtr", () => {
    const tokens: Token[] = [
      { kind: "num", val: 1 },
      { kind: "reserved", str: ">" },
      { kind: "num", val: 3 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "lss",
        lhs: {
          kind: "num",
          val: 3,
        },
        rhs: {
          kind: "num",
          val: 1,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("leq", () => {
    const tokens: Token[] = [
      { kind: "num", val: 1 },
      { kind: "reserved", str: "<=" },
      { kind: "num", val: 3 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "leq",
        lhs: {
          kind: "num",
          val: 1,
        },
        rhs: {
          kind: "num",
          val: 3,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("geq", () => {
    const tokens: Token[] = [
      { kind: "num", val: 1 },
      { kind: "reserved", str: ">=" },
      { kind: "num", val: 3 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "leq",
        lhs: {
          kind: "num",
          val: 3,
        },
        rhs: {
          kind: "num",
          val: 1,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("and", () => {
    const tokens: Token[] = [
      { kind: "num", val: 1 },
      { kind: "reserved", str: "&&" },
      { kind: "num", val: 2 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "and",
        lhs: {
          kind: "num",
          val: 1,
        },
        rhs: {
          kind: "num",
          val: 2,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("or", () => {
    const tokens: Token[] = [
      { kind: "num", val: 1 },
      { kind: "reserved", str: "||" },
      { kind: "num", val: 2 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "or",
        lhs: {
          kind: "num",
          val: 1,
        },
        rhs: {
          kind: "num",
          val: 2,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("complex operators", () => {
    const tokens: Token[] = [
      { kind: "reserved", str: "(" },
      { kind: "num", val: 5 },
      { kind: "reserved", str: "+" },
      { kind: "num", val: 8 },
      { kind: "reserved", str: ")" },
      { kind: "reserved", str: "*" },
      { kind: "num", val: 15 },
      { kind: "reserved", str: "-" },
      { kind: "num", val: 8 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "sub",
        lhs: {
          kind: "mul",
          lhs: {
            kind: "add",
            lhs: {
              kind: "num",
              val: 5,
            },
            rhs: {
              kind: "num",
              val: 8,
            },
          },
          rhs: {
            kind: "num",
            val: 15,
          },
        },
        rhs: {
          kind: "num",
          val: 8,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("assign", () => {
    const tokens: Token[] = [
      { kind: "ident", str: "x" },
      { kind: "reserved", str: "=" },
      { kind: "num", val: 4 },
      { kind: "reserved", str: "+" },
      { kind: "num", val: 5 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "assign",
        lhs: {
          kind: "var",
          index: 0,
        },
        rhs: {
          kind: "add",
          lhs: {
            kind: "num",
            val: 4,
          },
          rhs: {
            kind: "num",
            val: 5,
          },
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("var", () => {
    const tokens: Token[] = [
      { kind: "num", val: 2 },
      { kind: "reserved", str: "*" },
      { kind: "reserved", str: "(" },
      { kind: "num", val: 4 },
      { kind: "reserved", str: "+" },
      { kind: "ident", str: "x" },
      { kind: "reserved", str: ")" },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "mul",
        lhs: {
          kind: "num",
          val: 2,
        },
        rhs: {
          kind: "add",
          lhs: {
            kind: "num",
            val: 4,
          },
          rhs: {
            kind: "var",
            index: 0,
          },
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("input", () => {
    const tokens: Token[] = [
      { kind: "ident", str: "x" },
      { kind: "reserved", str: "=" },
      { kind: "reserved", str: "input" },
      { kind: "reserved", str: "(" },
      { kind: "reserved", str: ")" },
      { kind: "reserved", str: "+" },
      { kind: "num", val: 2 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "assign",
        lhs: {
          kind: "var",
          index: 0,
        },
        rhs: {
          kind: "add",
          lhs: {
            kind: "input",
          },
          rhs: {
            kind: "num",
            val: 2,
          },
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("putchar", () => {
    const tokens: Token[] = [
      { kind: "reserved", str: "putchar" },
      { kind: "reserved", str: "(" },
      { kind: "num", val: 2 },
      { kind: "reserved", str: "+" },
      { kind: "num", val: 3 },
      { kind: "reserved", str: ")" },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "putchar",
        arg: {
          kind: "add",
          lhs: {
            kind: "num",
            val: 2,
          },
          rhs: {
            kind: "num",
            val: 3,
          },
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("print", () => {
    const tokens: Token[] = [
      { kind: "reserved", str: "print" },
      { kind: "reserved", str: "(" },
      { kind: "num", val: 2 },
      { kind: "reserved", str: "+" },
      { kind: "num", val: 3 },
      { kind: "reserved", str: ")" },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "print",
        arg: {
          kind: "add",
          lhs: {
            kind: "num",
            val: 2,
          },
          rhs: {
            kind: "num",
            val: 3,
          },
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("if", () => {
    const tokens: Token[] = [
      { kind: "reserved", str: "if" },
      { kind: "reserved", str: "(" },
      { kind: "num", val: 1 },
      { kind: "reserved", str: "+" },
      { kind: "num", val: 2 },
      { kind: "reserved", str: ")" },
      { kind: "reserved", str: "{" },
      { kind: "reserved", str: "putchar" },
      { kind: "reserved", str: "(" },
      { kind: "num", val: 1 },
      { kind: "reserved", str: ")" },
      { kind: "reserved", str: ";" },
      { kind: "reserved", str: "}" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "if",
        cond: {
          kind: "add",
          lhs: {
            kind: "num",
            val: 1,
          },
          rhs: {
            kind: "num",
            val: 2,
          },
        },
        consequence: {
          kind: "block",
          stmts: [
            {
              kind: "putchar",
              arg: {
                kind: "num",
                val: 1,
              },
            },
          ],
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("if-else", () => {
    const tokens: Token[] = [
      { kind: "reserved", str: "if" },
      { kind: "reserved", str: "(" },
      { kind: "num", val: 1 },
      { kind: "reserved", str: "-" },
      { kind: "num", val: 1 },
      { kind: "reserved", str: ")" },
      { kind: "reserved", str: "{" },
      { kind: "reserved", str: "putchar" },
      { kind: "reserved", str: "(" },
      { kind: "num", val: 1 },
      { kind: "reserved", str: ")" },
      { kind: "reserved", str: ";" },
      { kind: "reserved", str: "}" },
      { kind: "reserved", str: "else" },
      { kind: "reserved", str: "{" },
      { kind: "reserved", str: "putchar" },
      { kind: "reserved", str: "(" },
      { kind: "num", val: 2 },
      { kind: "reserved", str: ")" },
      { kind: "reserved", str: ";" },
      { kind: "reserved", str: "}" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "if",
        cond: {
          kind: "sub",
          lhs: {
            kind: "num",
            val: 1,
          },
          rhs: {
            kind: "num",
            val: 1,
          },
        },
        consequence: {
          kind: "block",
          stmts: [
            {
              kind: "putchar",
              arg: {
                kind: "num",
                val: 1,
              },
            },
          ],
        },
        alternative: {
          kind: "block",
          stmts: [
            {
              kind: "putchar",
              arg: {
                kind: "num",
                val: 2,
              },
            },
          ],
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("for", () => {
    const tokens: Token[] = [
      { kind: "reserved", str: "for" },
      { kind: "reserved", str: "(" },
      { kind: "ident", str: "x" },
      { kind: "reserved", str: "=" },
      { kind: "num", val: 3 },
      { kind: "reserved", str: ";" },
      { kind: "ident", str: "x" },
      { kind: "reserved", str: ";" },
      { kind: "ident", str: "x" },
      { kind: "reserved", str: "=" },
      { kind: "ident", str: "x" },
      { kind: "reserved", str: "-" },
      { kind: "num", val: 1 },
      { kind: "reserved", str: ")" },
      { kind: "reserved", str: "{" },
      { kind: "reserved", str: "putchar" },
      { kind: "reserved", str: "(" },
      { kind: "ident", str: "x" },
      { kind: "reserved", str: ")" },
      { kind: "reserved", str: ";" },
      { kind: "reserved", str: "}" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "for",
        init: {
          kind: "assign",
          lhs: {
            kind: "var",
            index: 0,
          },
          rhs: {
            kind: "num",
            val: 3,
          },
        },
        cond: {
          kind: "var",
          index: 0,
        },
        after: {
          kind: "assign",
          lhs: {
            kind: "var",
            index: 0,
          },
          rhs: {
            kind: "sub",
            lhs: {
              kind: "var",
              index: 0,
            },
            rhs: {
              kind: "num",
              val: 1,
            },
          },
        },
        body: {
          kind: "block",
          stmts: [
            {
              kind: "putchar",
              arg: {
                kind: "var",
                index: 0,
              },
            },
          ],
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("while", () => {
    const tokens: Token[] = [
      { kind: "reserved", str: "while" },
      { kind: "reserved", str: "(" },
      { kind: "reserved", str: "++" },
      { kind: "ident", str: "x" },
      { kind: "reserved", str: "<" },
      { kind: "num", val: 3 },
      { kind: "reserved", str: ")" },
      { kind: "reserved", str: "putchar" },
      { kind: "reserved", str: "(" },
      { kind: "num", val: 48 },
      { kind: "reserved", str: "+" },
      { kind: "ident", str: "x" },
      { kind: "reserved", str: ")" },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "while",
        cond: {
          kind: "lss",
          lhs: {
            kind: "pre-inc",
            operand: {
              kind: "var",
              index: 0,
            },
          },
          rhs: {
            kind: "num",
            val: 3,
          },
        },
        body: {
          kind: "putchar",
          arg: {
            kind: "add",
            lhs: {
              kind: "num",
              val: 48,
            },
            rhs: {
              kind: "var",
              index: 0,
            },
          },
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("block", () => {
    const tokens: Token[] = [
      { kind: "ident", str: "z" },
      { kind: "reserved", str: "=" },
      { kind: "reserved", str: "{" },
      { kind: "ident", str: "x" },
      { kind: "reserved", str: "=" },
      { kind: "num", val: 1 },
      { kind: "reserved", str: ";" },
      { kind: "ident", str: "y" },
      { kind: "reserved", str: "=" },
      { kind: "num", val: 2 },
      { kind: "reserved", str: ";" },
      { kind: "reserved", str: "}" },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "assign",
        lhs: {
          kind: "var",
          index: 0,
        },
        rhs: {
          kind: "block",
          stmts: [
            {
              kind: "assign",
              lhs: {
                kind: "var",
                index: 1,
              },
              rhs: {
                kind: "num",
                val: 1,
              },
            },
            {
              kind: "assign",
              lhs: {
                kind: "var",
                index: 2,
              },
              rhs: {
                kind: "num",
                val: 2,
              },
            },
          ],
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  it("complex", () => {
    const tokens: Token[] = [
      { kind: "ident", str: "foo" },
      { kind: "reserved", str: "=" },
      { kind: "num", val: 1 },
      { kind: "reserved", str: ";" },
      { kind: "ident", str: "bar" },
      { kind: "reserved", str: "=" },
      { kind: "num", val: 2 },
      { kind: "reserved", str: ";" },
      { kind: "reserved", str: "putchar" },
      { kind: "reserved", str: "(" },
      { kind: "num", val: 1 },
      { kind: "reserved", str: "+" },
      { kind: "num", val: 2 },
      { kind: "reserved", str: "*" },
      { kind: "reserved", str: "(" },
      { kind: "num", val: 3 },
      { kind: "reserved", str: "+" },
      { kind: "num", val: 4 },
      { kind: "reserved", str: ")" },
      { kind: "reserved", str: "-" },
      { kind: "ident", str: "foo" },
      { kind: "reserved", str: "*" },
      { kind: "ident", str: "bar" },
      { kind: "reserved", str: ")" },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const expected: AstNode[] = [
      {
        kind: "assign",
        lhs: {
          kind: "var",
          index: 0,
        },
        rhs: {
          kind: "num",
          val: 1,
        },
      },
      {
        kind: "assign",
        lhs: {
          kind: "var",
          index: 1,
        },
        rhs: {
          kind: "num",
          val: 2,
        },
      },
      {
        kind: "putchar",
        arg: {
          kind: "sub",
          lhs: {
            kind: "add",
            lhs: {
              kind: "num",
              val: 1,
            },
            rhs: {
              kind: "mul",
              lhs: {
                kind: "num",
                val: 2,
              },
              rhs: {
                kind: "add",
                lhs: {
                  kind: "num",
                  val: 3,
                },
                rhs: {
                  kind: "num",
                  val: 4,
                },
              },
            },
          },
          rhs: {
            kind: "mul",
            lhs: {
              kind: "var",
              index: 0,
            },
            rhs: {
              kind: "var",
              index: 1,
            },
          },
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });
});
