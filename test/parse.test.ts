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

  test('mod', () => {
    const tokens: Token[] = [
      { kind: 'num', val: 5 },
      { kind: 'reserved', str: '%' },
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const expected: AstNode[] = [
      {
        kind: 'mod',
        lhs: {
          kind: 'num',
          val: 5,
        },
        rhs: {
          kind: 'num',
          val: 2,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  test('not', () => {
    const tokens: Token[] = [
      { kind: 'reserved', str: '!' },
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const expected: AstNode[] = [
      {
        kind: 'not',
        operand: {
          kind: 'num',
          val: 2,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  test('pre-inc', () => {
    const tokens: Token[] = [
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: '=' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: ';' },
      { kind: 'reserved', str: '++' },
      { kind: 'ident', str: 'x' },
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
        kind: 'pre-inc',
        operand: {
          kind: 'var',
          index: 0,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  test('pre-dec', () => {
    const tokens: Token[] = [
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: '=' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: ';' },
      { kind: 'reserved', str: '--' },
      { kind: 'ident', str: 'x' },
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
        kind: 'pre-dec',
        operand: {
          kind: 'var',
          index: 0,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  test('post-inc', () => {
    const tokens: Token[] = [
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: '=' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: ';' },
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: '++' },
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
        kind: 'post-inc',
        operand: {
          kind: 'var',
          index: 0,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  test('post-dec', () => {
    const tokens: Token[] = [
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: '=' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: ';' },
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: '--' },
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
        kind: 'post-dec',
        operand: {
          kind: 'var',
          index: 0,
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

  test('equ', () => {
    const tokens: Token[] = [
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: '==' },
      { kind: 'num', val: 3 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const expected: AstNode[] = [
      {
        kind: 'equ',
        lhs: {
          kind: 'num',
          val: 1,
        },
        rhs: {
          kind: 'num',
          val: 3,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  test('neq', () => {
    const tokens: Token[] = [
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: '!=' },
      { kind: 'num', val: 3 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const expected: AstNode[] = [
      {
        kind: 'neq',
        lhs: {
          kind: 'num',
          val: 1,
        },
        rhs: {
          kind: 'num',
          val: 3,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  test('lss', () => {
    const tokens: Token[] = [
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: '<' },
      { kind: 'num', val: 3 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const expected: AstNode[] = [
      {
        kind: 'lss',
        lhs: {
          kind: 'num',
          val: 1,
        },
        rhs: {
          kind: 'num',
          val: 3,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  test('gtr', () => {
    const tokens: Token[] = [
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: '>' },
      { kind: 'num', val: 3 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const expected: AstNode[] = [
      {
        kind: 'lss',
        lhs: {
          kind: 'num',
          val: 3,
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

  test('leq', () => {
    const tokens: Token[] = [
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: '<=' },
      { kind: 'num', val: 3 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const expected: AstNode[] = [
      {
        kind: 'leq',
        lhs: {
          kind: 'num',
          val: 1,
        },
        rhs: {
          kind: 'num',
          val: 3,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  test('geq', () => {
    const tokens: Token[] = [
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: '>=' },
      { kind: 'num', val: 3 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const expected: AstNode[] = [
      {
        kind: 'leq',
        lhs: {
          kind: 'num',
          val: 3,
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

  test('and', () => {
    const tokens: Token[] = [
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: '&&' },
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const expected: AstNode[] = [
      {
        kind: 'and',
        lhs: {
          kind: 'num',
          val: 1,
        },
        rhs: {
          kind: 'num',
          val: 2,
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  test('or', () => {
    const tokens: Token[] = [
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: '||' },
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const expected: AstNode[] = [
      {
        kind: 'or',
        lhs: {
          kind: 'num',
          val: 1,
        },
        rhs: {
          kind: 'num',
          val: 2,
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

  test('input', () => {
    const tokens: Token[] = [
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: '=' },
      { kind: 'input' },
      { kind: 'reserved', str: '(' },
      { kind: 'reserved', str: ')' },
      { kind: 'reserved', str: '+' },
      { kind: 'num', val: 2 },
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
            kind: 'input',
          },
          rhs: {
            kind: 'num',
            val: 2,
          },
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  test('putchar', () => {
    const tokens: Token[] = [
      { kind: 'putchar' },
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
        kind: 'putchar',
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

  test('if', () => {
    const tokens: Token[] = [
      { kind: 'if' },
      { kind: 'reserved', str: '(' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: '+' },
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: ')' },
      { kind: 'putchar' },
      { kind: 'reserved', str: '(' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: ')' },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const expected: AstNode[] = [
      {
        kind: 'if',
        cond: {
          kind: 'add',
          lhs: {
            kind: 'num',
            val: 1,
          },
          rhs: {
            kind: 'num',
            val: 2,
          },
        },
        caseTrue: {
          kind: 'putchar',
          arg: {
            kind: 'num',
            val: 1,
          },
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  test('if-else', () => {
    const tokens: Token[] = [
      { kind: 'if' },
      { kind: 'reserved', str: '(' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: '-' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: ')' },
      { kind: 'putchar' },
      { kind: 'reserved', str: '(' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: ')' },
      { kind: 'reserved', str: ';' },
      { kind: 'else' },
      { kind: 'putchar' },
      { kind: 'reserved', str: '(' },
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: ')' },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const expected: AstNode[] = [
      {
        kind: 'if',
        cond: {
          kind: 'sub',
          lhs: {
            kind: 'num',
            val: 1,
          },
          rhs: {
            kind: 'num',
            val: 1,
          },
        },
        caseTrue: {
          kind: 'putchar',
          arg: {
            kind: 'num',
            val: 1,
          },
        },
        caseFalse: {
          kind: 'putchar',
          arg: {
            kind: 'num',
            val: 2,
          },
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  test('for', () => {
    const tokens: Token[] = [
      { kind: 'for' },
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
      { kind: 'putchar' },
      { kind: 'reserved', str: '(' },
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: ')' },
      { kind: 'reserved', str: ';' },
      { kind: 'eof' },
    ];

    const expected: AstNode[] = [
      {
        kind: 'for',
        init: {
          kind: 'assign',
          lhs: {
            kind: 'var',
            index: 0,
          },
          rhs: {
            kind: 'num',
            val: 3,
          },
        },
        cond: {
          kind: 'var',
          index: 0,
        },
        after: {
          kind: 'assign',
          lhs: {
            kind: 'var',
            index: 0,
          },
          rhs: {
            kind: 'sub',
            lhs: {
              kind: 'var',
              index: 0,
            },
            rhs: {
              kind: 'num',
              val: 1,
            },
          },
        },
        whileTrue: {
          kind: 'putchar',
          arg: {
            kind: 'var',
            index: 0,
          },
        },
      },
    ];

    const nodes = parse(tokens);
    expect(nodes).toEqual(expected);
  });

  test('block', () => {
    const tokens: Token[] = [
      { kind: 'reserved', str: '{' },
      { kind: 'ident', str: 'x' },
      { kind: 'reserved', str: '=' },
      { kind: 'num', val: 1 },
      { kind: 'reserved', str: ';' },
      { kind: 'ident', str: 'y' },
      { kind: 'reserved', str: '=' },
      { kind: 'num', val: 2 },
      { kind: 'reserved', str: ';' },
      { kind: 'reserved', str: '}' },
      { kind: 'eof' },
    ];

    const expected: AstNode[] = [
      {
        kind: 'block',
        stmts: [
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
        ],
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
      { kind: 'putchar' },
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
        kind: 'putchar',
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
