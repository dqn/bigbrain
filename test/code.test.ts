import { generateCode } from '../src/code';
import { AstNode } from '../src/parse';

describe('parse', () => {
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

  test('print', () => {
    const nodes: AstNode[] = [
      {
        kind: 'print',
        arg: {
          kind: 'num',
          val: 5,
        },
      },
    ];

    const code = generateCode(nodes);
    expect(code).toEqual('+++++.');
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
});
