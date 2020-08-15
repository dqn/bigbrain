import { AstNode, parse } from '../src/parse';
import { Token } from '../src/tokenize';

describe('parse', () => {
  test('parse', () => {
    const tokens: Token[] = [
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

    const expected: AstNode[] = [
      {
        kind: 'assign',
        lhs: {
          kind: 'var',
          index: 0,
        },
        rhs: {
          kind: 'num',
          val: 1,
        },
      },
      {
        kind: 'assign',
        lhs: {
          kind: 'var',
          index: 1,
        },
        rhs: {
          kind: 'num',
          val: 2,
        },
      },
      {
        kind: 'print',
        arg: {
          kind: 'sub',
          lhs: {
            kind: 'add',
            lhs: {
              kind: 'num',
              val: 1,
            },
            rhs: {
              kind: 'mul',
              lhs: {
                kind: 'num',
                val: 2,
              },
              rhs: {
                kind: 'add',
                lhs: {
                  kind: 'num',
                  val: 3,
                },
                rhs: {
                  kind: 'num',
                  val: 4,
                },
              },
            },
          },
          rhs: {
            kind: 'mul',
            lhs: {
              kind: 'var',
              index: 0,
            },
            rhs: {
              kind: 'var',
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
