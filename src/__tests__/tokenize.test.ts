import { Token, tokenize } from "../tokenize";

describe("tokenize", () => {
  it("add", () => {
    const src = "2 + 3 + 42;";

    const expected: Token[] = [
      { kind: "num", val: 2 },
      { kind: "reserved", str: "+" },
      { kind: "num", val: 3 },
      { kind: "reserved", str: "+" },
      { kind: "num", val: 42 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("sub", () => {
    const src = "10 - 2 - 1;";

    const expected: Token[] = [
      { kind: "num", val: 10 },
      { kind: "reserved", str: "-" },
      { kind: "num", val: 2 },
      { kind: "reserved", str: "-" },
      { kind: "num", val: 1 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("mul", () => {
    const src = "5 * 8 * 10;";

    const expected: Token[] = [
      { kind: "num", val: 5 },
      { kind: "reserved", str: "*" },
      { kind: "num", val: 8 },
      { kind: "reserved", str: "*" },
      { kind: "num", val: 10 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("div", () => {
    const src = "6 / 2;";

    const expected: Token[] = [
      { kind: "num", val: 6 },
      { kind: "reserved", str: "/" },
      { kind: "num", val: 2 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("mod", () => {
    const src = "5 % 2;";

    const expected: Token[] = [
      { kind: "num", val: 5 },
      { kind: "reserved", str: "%" },
      { kind: "num", val: 2 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("exp", () => {
    const src = "2 ** 1 ** 2;";

    const expected: Token[] = [
      { kind: "num", val: 2 },
      { kind: "reserved", str: "**" },
      { kind: "num", val: 1 },
      { kind: "reserved", str: "**" },
      { kind: "num", val: 2 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("not", () => {
    const src = "!2;";

    const expected: Token[] = [
      { kind: "reserved", str: "!" },
      { kind: "num", val: 2 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("pre-inc", () => {
    const src = "x = 1; ++x;";

    const expected: Token[] = [
      { kind: "ident", str: "x" },
      { kind: "reserved", str: "=" },
      { kind: "num", val: 1 },
      { kind: "reserved", str: ";" },
      { kind: "reserved", str: "++" },
      { kind: "ident", str: "x" },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("pre-dec", () => {
    const src = "x = 1; --x;";

    const expected: Token[] = [
      { kind: "ident", str: "x" },
      { kind: "reserved", str: "=" },
      { kind: "num", val: 1 },
      { kind: "reserved", str: ";" },
      { kind: "reserved", str: "--" },
      { kind: "ident", str: "x" },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("post-inc", () => {
    const src = "x = 1; x++;";

    const expected: Token[] = [
      { kind: "ident", str: "x" },
      { kind: "reserved", str: "=" },
      { kind: "num", val: 1 },
      { kind: "reserved", str: ";" },
      { kind: "ident", str: "x" },
      { kind: "reserved", str: "++" },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("post-dec", () => {
    const src = "x = 1; x--;";

    const expected: Token[] = [
      { kind: "ident", str: "x" },
      { kind: "reserved", str: "=" },
      { kind: "num", val: 1 },
      { kind: "reserved", str: ";" },
      { kind: "ident", str: "x" },
      { kind: "reserved", str: "--" },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("parences", () => {
    const src = "4 * (11 + 6);";

    const expected: Token[] = [
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

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("equ", () => {
    const src = "1 == 3;";

    const expected: Token[] = [
      { kind: "num", val: 1 },
      { kind: "reserved", str: "==" },
      { kind: "num", val: 3 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("neq", () => {
    const src = "1 != 3;";

    const expected: Token[] = [
      { kind: "num", val: 1 },
      { kind: "reserved", str: "!=" },
      { kind: "num", val: 3 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("lss", () => {
    const src = "1 < 3;";

    const expected: Token[] = [
      { kind: "num", val: 1 },
      { kind: "reserved", str: "<" },
      { kind: "num", val: 3 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("gtr", () => {
    const src = "1 > 3;";

    const expected: Token[] = [
      { kind: "num", val: 1 },
      { kind: "reserved", str: ">" },
      { kind: "num", val: 3 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("leq", () => {
    const src = "1 <= 3;";

    const expected: Token[] = [
      { kind: "num", val: 1 },
      { kind: "reserved", str: "<=" },
      { kind: "num", val: 3 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("geq", () => {
    const src = "1 >= 3;";

    const expected: Token[] = [
      { kind: "num", val: 1 },
      { kind: "reserved", str: ">=" },
      { kind: "num", val: 3 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("and", () => {
    const src = "1 && 2;";

    const expected: Token[] = [
      { kind: "num", val: 1 },
      { kind: "reserved", str: "&&" },
      { kind: "num", val: 2 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("or", () => {
    const src = "1 || 2;";

    const expected: Token[] = [
      { kind: "num", val: 1 },
      { kind: "reserved", str: "||" },
      { kind: "num", val: 2 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("complex operators", () => {
    const src = "(5 + 8) * 15 - 8;";

    const expected: Token[] = [
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

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("assign", () => {
    const src = "x = 4 + 5;";

    const expected: Token[] = [
      { kind: "ident", str: "x" },
      { kind: "reserved", str: "=" },
      { kind: "num", val: 4 },
      { kind: "reserved", str: "+" },
      { kind: "num", val: 5 },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("var", () => {
    const src = "2 * (4 + x);";

    const expected: Token[] = [
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

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("input", () => {
    const src = "x = input() + 2;";

    const expected: Token[] = [
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

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("putchar", () => {
    const src = "putchar(2 + 3);";

    const expected: Token[] = [
      { kind: "reserved", str: "putchar" },
      { kind: "reserved", str: "(" },
      { kind: "num", val: 2 },
      { kind: "reserved", str: "+" },
      { kind: "num", val: 3 },
      { kind: "reserved", str: ")" },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("print", () => {
    const src = "print(2 + 3);";

    const expected: Token[] = [
      { kind: "reserved", str: "print" },
      { kind: "reserved", str: "(" },
      { kind: "num", val: 2 },
      { kind: "reserved", str: "+" },
      { kind: "num", val: 3 },
      { kind: "reserved", str: ")" },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("if", () => {
    const src = "if (1 + 2) { putchar(1); }";

    const expected: Token[] = [
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

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("if-else", () => {
    const src = "if (1 - 1) { putchar(1); } else { putchar(2); }";

    const expected: Token[] = [
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

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("for", () => {
    const src = "for (x = 3; x; x = x - 1) putchar(x);";

    const expected: Token[] = [
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
      { kind: "reserved", str: "putchar" },
      { kind: "reserved", str: "(" },
      { kind: "ident", str: "x" },
      { kind: "reserved", str: ")" },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("while", () => {
    const src = "while (++x < 3) putchar(48 + x);";

    const expected: Token[] = [
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

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("block", () => {
    const src = "z = { x = 1; y = 2 };";

    const expected: Token[] = [
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
      { kind: "reserved", str: "}" },
      { kind: "reserved", str: ";" },
      { kind: "eof" },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  it("multi statements", () => {
    const src = `
foo = 1;
bar = 2;
putchar(1 + 2 * (3 + 4) - foo * bar);
`;

    const expected: Token[] = [
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

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });
});
