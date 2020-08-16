import { AstNode, parse } from '../src/parse';
import { Token } from '../src/tokenize';

describe('parse', () => {
  test('add', () => {
    const tokens: Token[] = [
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: '+' },
      { kind: 'num', val: 3 },
      { kind: 'reserved', str: '+' },
      { kind: 'num', val: 42 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const expected: AstNode[] = [
      {
        kind: 'add',
        lhs: {
          kind: 'add',
          lhs: {
            kind: 'num',
            val: 2,
          },
          rhs: {
            kind: 'num',
            val: 3,
          },
        },
        rhs: {
          kind: 'num',
          val: 42,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  test('sub', () => {
    const tokens: Token[] = [
      { kind: 'num', val: 10 },
      { kind: 'reserved', str: '-' },
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: '-' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const expected: AstNode[] = [
      {
        kind: 'sub',
        lhs: {
          kind: 'sub',
          lhs: {
            kind: 'num',
            val: 10,
          },
          rhs: {
            kind: 'num',
            val: 2,
          },
        },
        rhs: {
          kind: 'num',
          val: 1,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  test('mul', () => {
    const tokens: Token[] = [
      { kind: 'num', val: 5 },
      { kind: 'reserved', str: '*' },
      { kind: 'num', val: 8 },
      { kind: 'reserved', str: '*' },
      { kind: 'num', val: 10 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const expected: AstNode[] = [
      {
        kind: 'mul',
        lhs: {
          kind: 'mul',
          lhs: {
            kind: 'num',
            val: 5,
          },
          rhs: {
            kind: 'num',
            val: 8,
          },
        },
        rhs: {
          kind: 'num',
          val: 10,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  test('parences', () => {
    const tokens: Token[] = [
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

    const expected: AstNode[] = [
      {
        kind: 'mul',
        lhs: {
          kind: 'num',
          val: 4,
        },
        rhs: {
          kind: 'add',
          lhs: {
            kind: 'num',
            val: 11,
          },
          rhs: {
            kind: 'num',
            val: 6,
          },
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  test('complex operators', () => {
    const tokens: Token[] = [
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

    const expected: AstNode[] = [
      {
        kind: 'sub',
        lhs: {
          kind: 'mul',
          lhs: {
            kind: 'add',
            lhs: {
              kind: 'num',
              val: 5,
            },
            rhs: {
              kind: 'num',
              val: 8,
            },
          },
          rhs: {
            kind: 'num',
            val: 15,
          },
        },
        rhs: {
          kind: 'num',
          val: 8,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  test('assign', () => {
    const tokens: Token[] = [
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: '=' },
      { kind: 'num', val: 4 },
      { kind: 'reserved', str: '+' },
      { kind: 'num', val: 5 },
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
          kind: 'add',
          lhs: {
            kind: 'num',
            val: 4,
          },
          rhs: {
            kind: 'num',
            val: 5,
          },
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  test('var', () => {
    const tokens: Token[] = [
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

    const expected: AstNode[] = [
      {
        kind: 'mul',
        lhs: {
          kind: 'num',
          val: 2,
        },
        rhs: {
          kind: 'add',
          lhs: {
            kind: 'num',
            val: 4,
          },
          rhs: {
            kind: 'var',
            index: 0,
          },
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  test('print', () => {
    const tokens: Token[] = [
      { kind: 'print' },
      { kind: 'reserved', str: '(' },
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: '+' },
      { kind: 'num', val: 3 },
      { kind: 'reserved', str: ')' },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const expected: AstNode[] = [
      {
        kind: 'print',
        arg: {
          kind: 'add',
          lhs: {
            kind: 'num',
            val: 2,
          },
          rhs: {
            kind: 'num',
            val: 3,
          },
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  test('complex', () => {
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
