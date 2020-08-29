import { generateCode } from '../src/code';
import { AstNode } from '../src/parse';

describe('code', () => {
  test('num', () => {
    const nodes: AstNode[] = [
      {
        kind: 'num',
        val: 13,
      },
    ];

    const code = generateCode(nodes);
    expect(code).toEqual('+++++++++++++');
  });

  test('input', () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual('>,>++[<+>-]<<[-]>[<+>>+<-]');
  });

  test('putchar', () => {
    const nodes: AstNode[] = [
      {
        kind: 'putchar',
        arg: {
          kind: 'num',
          val: 5,
        },
      },
    ];

    const code = generateCode(nodes);
    expect(code).toEqual('+++++.[-]');
  });

  test('print', () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual(
      '++>+++[<+>-]++++++++++<[->->+<[>>+>+<<<-]>>>[<<<+>>>-]+<[>-<[-]]>[<<[<+>-]>>>+<-]<<<<]>>[>>>>>+<<<<<-]>>>[<<<<<+>>>>>-]<<<<[-]++++++++++<[->->+<[>>+>+<<<-]>>>[<<<+>>>-]+<[>-<[-]]>[<<[<+>-]>>>+<-]<<<<]>>[>>>>+<<<<-]>>>[++++++++++++++++++++++++++++++++++++++++++++++++.<+>>+<[-]]>[<<[>>-<<-]>>++++++++++++++++++++++++++++++++++++++++++++++++.[-]]>++++++++++++++++++++++++++++++++++++++++++++++++.[-]<<<<<<[-]',
    );
  });

  test('add', () => {
    const nodes: AstNode[] = [
      {
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
    ];

    const code = generateCode(nodes);
    expect(code).toEqual('+++>++++[<+>-]');
  });

  test('sub', () => {
    const nodes: AstNode[] = [
      {
        kind: 'sub',
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

    const code = generateCode(nodes);
    expect(code).toEqual('+++++>++[<->-]');
  });

  test('mul', () => {
    const nodes: AstNode[] = [
      {
        kind: 'mul',
        lhs: {
          kind: 'num',
          val: 4,
        },
        rhs: {
          kind: 'num',
          val: 3,
        },
      },
    ];

    const code = generateCode(nodes);
    expect(code).toEqual('++++>+++<[>[>+>+<<-]>>[<<+>>-]<<<-]>[-]>[<<+>>-]');
  });

  test('div', () => {
    const nodes: AstNode[] = [
      {
        kind: 'div',
        lhs: {
          kind: 'num',
          val: 6,
        },
        rhs: {
          kind: 'num',
          val: 2,
        },
      },
    ];

    const code = generateCode(nodes);
    expect(code).toEqual(
      '++++++>++<[>>+<<-]>>[<[>>+>+<<<-]>>>[<<<+>>>-]<[>+<<-[>>[-]>+<<<-]>>>[<<<+>>>-]<[<-[<<<->>>[-]]+>-]<-]<<<+>>]<[-]',
    );
  });

  test('mod', () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual(
      '+++++>++<[>->+<[>>+>+<<<-]>>>[<<<+>>>-]+<[>-<[-]]>[<<[<+>-]>>-]<<<<-]>[-]',
    );
  });

  test('exp', () => {
    const nodes: AstNode[] = [
      {
        kind: 'exp',
        lhs: {
          kind: 'num',
          val: 2,
        },
        rhs: {
          kind: 'exp',
          lhs: {
            kind: 'num',
            val: 1,
          },
          rhs: {
            kind: 'num',
            val: 2,
          },
        },
      },
    ];

    const code = generateCode(nodes);
    expect(code).toEqual(
      '++>+>++<[>>+<<-]+>[>>[-]>[-]<<<<[>>>>+<<<<-]>>>>[<<[<<+>>>+<-]>[<+>-]>-]<<<-]>[-]<<<[>>+<<-]+>[>>[-]>[-]<<<<[>>>>+<<<<-]>>>>[<<[<<+>>>+<-]>[<+>-]>-]<<<-]>[-]',
    );
  });

  test('not', () => {
    const nodes: AstNode[] = [
      {
        kind: 'not',
        operand: {
          kind: 'num',
          val: 2,
        },
      },
    ];

    const code = generateCode(nodes);
    expect(code).toEqual('++>+<[>-<[-]]');
  });

  test('pre-inc', () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual('>+<[-]>[<+>>+<-]>[-]<<+[>>+<+<-]>[<+>-]');
  });

  test('pre-dec', () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual('>+<[-]>[<+>>+<-]>[-]<<-[>>+<+<-]>[<+>-]');
  });

  test('post-inc', () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual('>+<[-]>[<+>>+<-]>[-]<<[>>+<+<-]>[<+>-]<+');
  });

  test('post-dec', () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual('>+<[-]>[<+>>+<-]>[-]<<[>>+<+<-]>[<+>-]<-');
  });

  test('equ', () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual('+>+++<[>-<-]+>[<->[-]]');
  });

  test('neq', () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual('+>+++<[>-<-]>[<+>[-]]');
  });

  test('lss', () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual('+>+++<[->[>+>+<<-]>>[<<+>>-]+<[<->>-<[-]]>[<<<[-]>>>-]<<<]>[<+>[-]]');
  });

  test('leq', () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual('+>+++[-<[>>+>+<<<-]>>>[<<<+>>>-]+<[<<->>>-<[-]]>[<<[-]>>-]<<]+<[>-<[-]]');
  });

  test('and', () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual('+>++<[>>+<<[-]]>[>+<[-]]++>[<->-]+<[>-<[-]]');
  });

  test('or', () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual('+>++<[>>+<<[-]]>[>+<[-]]>[<+>[-]]');
  });

  test('assign', () => {
    const nodes: AstNode[] = [
      {
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
    ];

    const code = generateCode(nodes);
    expect(code).toEqual('>+++<[-]>[<+>>+<-]');
  });

  test('var', () => {
    const nodes: AstNode[] = [
      {
        kind: 'assign',
        lhs: {
          kind: 'var',
          index: 0,
        },
        rhs: {
          kind: 'num',
          val: 4,
        },
      },
      {
        kind: 'var',
        index: 0,
      },
    ];

    const code = generateCode(nodes);
    expect(code).toEqual('>++++<[-]>[<+>>+<-]>[-]<<[>>+<+<-]>[<+>-]');
  });

  test('if', () => {
    const nodes: AstNode[] = [
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
          kind: 'block',
          stmts: [
            {
              kind: 'putchar',
              arg: {
                kind: 'num',
                val: 1,
              },
            },
          ],
        },
      },
    ];

    const code = generateCode(nodes);
    expect(code).toEqual('+>++[<+>-]<[>+.[-]<[-]]');
  });

  test('if-else', () => {
    const nodes: AstNode[] = [
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
          kind: 'block',
          stmts: [
            {
              kind: 'putchar',
              arg: {
                kind: 'num',
                val: 1,
              },
            },
          ],
        },
        caseFalse: {
          kind: 'block',
          stmts: [
            {
              kind: 'putchar',
              arg: {
                kind: 'num',
                val: 2,
              },
            },
          ],
        },
      },
    ];

    const code = generateCode(nodes);
    expect(code).toEqual('+>+[<->-]+<[>>+.[-]<-<[-]]>[<++.[-]>-]');
  });

  test('for', () => {
    const nodes: AstNode[] = [
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

    /**
     * >+++ [0, 3] // make 3
     * <[-] [0, 3] // reset 'x'
     * >[<+>>+<-] [3, 0, 3]   // assign 3 to 'x'
     * >[-] [3, 0, 0] // free
     * <<[>>+<+<-] [0, 3, 3]
     * >[<+>-] [3, 0, 3]      // compute cond
     * >[
     *   <<[>+>>+<<<-]
     *   >>>[<<<+>>>-] [3, 3, 3, 0] // copy 'x'
     *   <<.[-] [3, 0, 3]           // free
     *   <[>+>>+<<<-] [0, 3, 3, 3]
     *   >>>[<<<+>>>-] [3, 3, 3, 0] // copy 'x'
     *   + [3, 3, 3, 1]             // make 1
     *   [<<->>-] [3, 2, 3, 0]      // x = x - 1
     *   <<<[-] [0, 2, 3, 0]        // reset x
     *   >[<+>>>+<<-] [2, 0, 3, 2]
     *   >>[-] [2, 0, 3, 0]         // assign 2 to 'x'
     *   <[-] [2, 0, 0, 0]          // reset cond
     *   <<[>>>+<<+<-] [0, 2, 0, 2]
     *   >[<+>-] [2, 0, 0, 2]
     *   >>[<+>-] [2, 0, 2, 0]      // compute cond
     *   <
     * ][-]
     */

    const code = generateCode(nodes);
    expect(code).toEqual(
      '>+++<[-]>[<+>>+<-]>[-]<<[>>+<+<-]>[<+>-]>[<<[>+>>+<<<-]>>>[<<<+>>>-]<<.[-]<[>+>>+<<<-]>>>[<<<+>>>-]+[<<->>-]<<<[-]>[<+>>>+<<-]>>[-]<[-]<<[>>>+<<+<-]>[<+>-]>>[<+>-]<]',
    );
  });

  test('while', () => {
    const nodes: AstNode[] = [
      {
        kind: 'while',
        cond: {
          kind: 'lss',
          lhs: {
            kind: 'pre-inc',
            operand: {
              kind: 'var',
              index: 0,
            },
          },
          rhs: {
            kind: 'num',
            val: 3,
          },
        },
        whileTrue: {
          kind: 'putchar',
          arg: {
            kind: 'add',
            lhs: {
              kind: 'num',
              val: 48,
            },
            rhs: {
              kind: 'var',
              index: 0,
            },
          },
        },
      },
    ];

    const code = generateCode(nodes);
    expect(code).toEqual(
      '+[>+>+<<-]>>[<<+>>-]+++<[->[>+>+<<-]>>[<<+>>-]+<[<->>-<[-]]>[<<<[-]>>>-]<<<]>[<+>[-]]<[>>++++++[<++++++++>-]<<<[>>>+>+<<<<-]>>>>[<<<<+>>>>-]<[<+>-]<.[-]<[-]<+[>>+>+<<<-]>>>[<<<+>>>-]+++<[->[>+>+<<-]>>[<<+>>-]+<[<->>-<[-]]>[<<<[-]>>>-]<<<]>[<+>[-]]<[<+>-]<]',
    );
  });

  test('block', () => {
    const nodes: AstNode[] = [
      {
        kind: 'assign',
        lhs: {
          kind: 'var',
          index: 0,
        },
        rhs: {
          kind: 'block',
          stmts: [
            {
              kind: 'assign',
              lhs: {
                kind: 'var',
                index: 1,
              },
              rhs: {
                kind: 'num',
                val: 1,
              },
            },
            {
              kind: 'rtn',
              expr: {
                kind: 'assign',
                lhs: {
                  kind: 'var',
                  index: 2,
                },
                rhs: {
                  kind: 'num',
                  val: 2,
                },
              },
            },
          ],
        },
      },
    ];

    const code = generateCode(nodes);
    expect(code).toEqual('>>>+<<[-]>>[<<+>>>+<-]>[-]++<<[-]>>[<<+>+>-]<<<<[-]>>>[<<<+>>>>+<-]');
  });
});
