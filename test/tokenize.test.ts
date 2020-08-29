import { Token, tokenize } from '../src/tokenize';

describe('tokenize', () => {
  test('add', () => {
    const src = '2 + 3 + 42;';

    const expected: Token[] = [
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: '+' },
      { kind: 'num', val: 3 },
      { kind: 'reserved', str: '+' },
      { kind: 'num', val: 42 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('sub', () => {
    const src = '10 - 2 - 1;';

    const expected: Token[] = [
      { kind: 'num', val: 10 },
      { kind: 'reserved', str: '-' },
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: '-' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('mul', () => {
    const src = '5 * 8 * 10;';

    const expected: Token[] = [
      { kind: 'num', val: 5 },
      { kind: 'reserved', str: '*' },
      { kind: 'num', val: 8 },
      { kind: 'reserved', str: '*' },
      { kind: 'num', val: 10 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('div', () => {
    const src = '6 / 2;';

    const expected: Token[] = [
      { kind: 'num', val: 6 },
      { kind: 'reserved', str: '/' },
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('mod', () => {
    const src = '5 % 2;';

    const expected: Token[] = [
      { kind: 'num', val: 5 },
      { kind: 'reserved', str: '%' },
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('exp', () => {
    const src = '2 ** 1 ** 2;';

    const expected: Token[] = [
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: '**' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: '**' },
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('not', () => {
    const src = '!2;';

    const expected: Token[] = [
      { kind: 'reserved', str: '!' },
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('pre-inc', () => {
    const src = 'x = 1; ++x;';

    const expected: Token[] = [
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: '=' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: ';' },
      { kind: 'reserved', str: '++' },
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('pre-dec', () => {
    const src = 'x = 1; --x;';

    const expected: Token[] = [
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: '=' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: ';' },
      { kind: 'reserved', str: '--' },
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('post-inc', () => {
    const src = 'x = 1; x++;';

    const expected: Token[] = [
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: '=' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: ';' },
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: '++' },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('post-dec', () => {
    const src = 'x = 1; x--;';

    const expected: Token[] = [
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: '=' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: ';' },
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: '--' },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('parences', () => {
    const src = '4 * (11 + 6);';

    const expected: Token[] = [
      { kind: 'num', val: 4 },
      { kind: 'reserved', str: '*' },
      { kind: 'reserved', str: '(' },
      { kind: 'num', val: 11 },
      { kind: 'reserved', str: '+' },
      { kind: 'num', val: 6 },
      { kind: 'reserved', str: ')' },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('equ', () => {
    const src = '1 == 3;';

    const expected: Token[] = [
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: '==' },
      { kind: 'num', val: 3 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('neq', () => {
    const src = '1 != 3;';

    const expected: Token[] = [
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: '!=' },
      { kind: 'num', val: 3 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('lss', () => {
    const src = '1 < 3;';

    const expected: Token[] = [
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: '<' },
      { kind: 'num', val: 3 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('gtr', () => {
    const src = '1 > 3;';

    const expected: Token[] = [
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: '>' },
      { kind: 'num', val: 3 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('leq', () => {
    const src = '1 <= 3;';

    const expected: Token[] = [
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: '<=' },
      { kind: 'num', val: 3 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('geq', () => {
    const src = '1 >= 3;';

    const expected: Token[] = [
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: '>=' },
      { kind: 'num', val: 3 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('and', () => {
    const src = '1 && 2;';

    const expected: Token[] = [
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: '&&' },
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('or', () => {
    const src = '1 || 2;';

    const expected: Token[] = [
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: '||' },
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('complex operators', () => {
    const src = '(5 + 8) * 15 - 8;';

    const expected: Token[] = [
      { kind: 'reserved', str: '(' },
      { kind: 'num', val: 5 },
      { kind: 'reserved', str: '+' },
      { kind: 'num', val: 8 },
      { kind: 'reserved', str: ')' },
      { kind: 'reserved', str: '*' },
      { kind: 'num', val: 15 },
      { kind: 'reserved', str: '-' },
      { kind: 'num', val: 8 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('assign', () => {
    const src = 'x = 4 + 5;';

    const expected: Token[] = [
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: '=' },
      { kind: 'num', val: 4 },
      { kind: 'reserved', str: '+' },
      { kind: 'num', val: 5 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('var', () => {
    const src = '2 * (4 + x);';

    const expected: Token[] = [
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: '*' },
      { kind: 'reserved', str: '(' },
      { kind: 'num', val: 4 },
      { kind: 'reserved', str: '+' },
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: ')' },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('input', () => {
    const src = 'x = input() + 2;';

    const expected: Token[] = [
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: '=' },
      { kind: 'reserved', str: 'input' },
      { kind: 'reserved', str: '(' },
      { kind: 'reserved', str: ')' },
      { kind: 'reserved', str: '+' },
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('putchar', () => {
    const src = 'putchar(2 + 3);';

    const expected: Token[] = [
      { kind: 'reserved', str: 'putchar' },
      { kind: 'reserved', str: '(' },
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: '+' },
      { kind: 'num', val: 3 },
      { kind: 'reserved', str: ')' },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('print', () => {
    const src = 'print(2 + 3);';

    const expected: Token[] = [
      { kind: 'reserved', str: 'print' },
      { kind: 'reserved', str: '(' },
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: '+' },
      { kind: 'num', val: 3 },
      { kind: 'reserved', str: ')' },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('if', () => {
    const src = 'if (1 + 2) { putchar(1); }';

    const expected: Token[] = [
      { kind: 'reserved', str: 'if' },
      { kind: 'reserved', str: '(' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: '+' },
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: ')' },
      { kind: 'reserved', str: '{' },
      { kind: 'reserved', str: 'putchar' },
      { kind: 'reserved', str: '(' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: ')' },
      { kind: 'reserved', str: ';' },
      { kind: 'reserved', str: '}' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('if-else', () => {
    const src = 'if (1 - 1) { putchar(1); } else { putchar(2); }';

    const expected: Token[] = [
      { kind: 'reserved', str: 'if' },
      { kind: 'reserved', str: '(' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: '-' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: ')' },
      { kind: 'reserved', str: '{' },
      { kind: 'reserved', str: 'putchar' },
      { kind: 'reserved', str: '(' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: ')' },
      { kind: 'reserved', str: ';' },
      { kind: 'reserved', str: '}' },
      { kind: 'reserved', str: 'else' },
      { kind: 'reserved', str: '{' },
      { kind: 'reserved', str: 'putchar' },
      { kind: 'reserved', str: '(' },
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: ')' },
      { kind: 'reserved', str: ';' },
      { kind: 'reserved', str: '}' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('for', () => {
    const src = 'for (x = 3; x; x = x - 1) putchar(x);';

    const expected: Token[] = [
      { kind: 'reserved', str: 'for' },
      { kind: 'reserved', str: '(' },
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: '=' },
      { kind: 'num', val: 3 },
      { kind: 'reserved', str: ';' },
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: ';' },
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: '=' },
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: '-' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: ')' },
      { kind: 'reserved', str: 'putchar' },
      { kind: 'reserved', str: '(' },
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: ')' },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('while', () => {
    const src = 'while (++x < 3) putchar(48 + x);';

    const expected: Token[] = [
      { kind: 'reserved', str: 'while' },
      { kind: 'reserved', str: '(' },
      { kind: 'reserved', str: '++' },
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: '<' },
      { kind: 'num', val: 3 },
      { kind: 'reserved', str: ')' },
      { kind: 'reserved', str: 'putchar' },
      { kind: 'reserved', str: '(' },
      { kind: 'num', val: 48 },
      { kind: 'reserved', str: '+' },
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: ')' },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('block', () => {
    const src = 'z = { x = 1; y = 2 };';

    const expected: Token[] = [
      { kind: 'ident', str: 'z' },
      { kind: 'reserved', str: '=' },
      { kind: 'reserved', str: '{' },
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: '=' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: ';' },
      { kind: 'ident', str: 'y' },
      { kind: 'reserved', str: '=' },
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: '}' },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });

  test('multi statements', () => {
    const src = `
foo = 1;
bar = 2;
putchar(1 + 2 * (3 + 4) - foo * bar);
`;

    const expected: Token[] = [
      { kind: 'ident', str: 'foo' },
      { kind: 'reserved', str: '=' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: ';' },
      { kind: 'ident', str: 'bar' },
      { kind: 'reserved', str: '=' },
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: ';' },
      { kind: 'reserved', str: 'putchar' },
      { kind: 'reserved', str: '(' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: '+' },
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: '*' },
      { kind: 'reserved', str: '(' },
      { kind: 'num', val: 3 },
      { kind: 'reserved', str: '+' },
      { kind: 'num', val: 4 },
      { kind: 'reserved', str: ')' },
      { kind: 'reserved', str: '-' },
      { kind: 'ident', str: 'foo' },
      { kind: 'reserved', str: '*' },
      { kind: 'ident', str: 'bar' },
      { kind: 'reserved', str: ')' },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const tokens = tokenize(src);
    expect(tokens).toEqual(expected);
  });
});
