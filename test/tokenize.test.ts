import { Token, tokenize } from '../src/tokenize';

describe('tokenize', () => {
  test('tokenize', () => {
    const src = `
foo = 1;
bar = 2;
print(1 + 2 * (3 + 4) - foo * bar);
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
      { kind: 'print' },
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
