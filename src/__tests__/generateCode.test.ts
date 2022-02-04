import { generateCode } from "../generateCode";
import type { AstNode } from "../parse";

describe("code", () => {
  it("num", () => {
    const nodes: AstNode[] = [
      {
        kind: "num",
        val: 13,
      },
    ];

    const code = generateCode(nodes);
    expect(code).toEqual("+++++++++++++");
  });

  it("input", () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual(">,>++[<+>-]<<[-]>[<+>>+<-]");
  });

  it("putchar", () => {
    const nodes: AstNode[] = [
      {
        kind: "putchar",
        arg: {
          kind: "num",
          val: 5,
        },
      },
    ];

    const code = generateCode(nodes);
    expect(code).toEqual("+++++.[-]");
  });

  it("print", () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual(
      "++>+++[<+>-]++++++++++<[->->+<[>>+>+<<<-]>>>[<<<+>>>-]+<[>-<[-]]>[<<[<+>-]>>>+<-]<<<<]>>[>>>>>+<<<<<-]>>>[<<<<<+>>>>>-]<<<<[-]++++++++++<[->->+<[>>+>+<<<-]>>>[<<<+>>>-]+<[>-<[-]]>[<<[<+>-]>>>+<-]<<<<]>>[>>>>+<<<<-]>>>[++++++++++++++++++++++++++++++++++++++++++++++++.<+>>+<[-]]>[<<[>>-<<-]>>++++++++++++++++++++++++++++++++++++++++++++++++.[-]]>++++++++++++++++++++++++++++++++++++++++++++++++.[-]<<<<<<[-]",
    );
  });

  it("add", () => {
    const nodes: AstNode[] = [
      {
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
    ];

    const code = generateCode(nodes);
    expect(code).toEqual("+++>++++[<+>-]");
  });

  it("sub", () => {
    const nodes: AstNode[] = [
      {
        kind: "sub",
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

    const code = generateCode(nodes);
    expect(code).toEqual("+++++>++[<->-]");
  });

  it("mul", () => {
    const nodes: AstNode[] = [
      {
        kind: "mul",
        lhs: {
          kind: "num",
          val: 4,
        },
        rhs: {
          kind: "num",
          val: 3,
        },
      },
    ];

    const code = generateCode(nodes);
    expect(code).toEqual("++++>+++<[>[>+>+<<-]>>[<<+>>-]<<<-]>[-]>[<<+>>-]");
  });

  it("div", () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual(
      "++++++>++<[>>+<<-]>>[<[>>+>+<<<-]>>>[<<<+>>>-]<[>+<<-[>>[-]>+<<<-]>>>[<<<+>>>-]<[<-[<<<->>>[-]]+>-]<-]<<<+>>]<[-]",
    );
  });

  it("mod", () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual(
      "+++++>++<[>->+<[>>+>+<<<-]>>>[<<<+>>>-]+<[>-<[-]]>[<<[<+>-]>>-]<<<<-]>[-]",
    );
  });

  it("exp", () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual(
      "++>+>++<[>>+<<-]+>[>>[-]>[-]<<<<[>>>>+<<<<-]>>>>[<<[<<+>>>+<-]>[<+>-]>-]<<<-]>[-]<<<[>>+<<-]+>[>>[-]>[-]<<<<[>>>>+<<<<-]>>>>[<<[<<+>>>+<-]>[<+>-]>-]<<<-]>[-]",
    );
  });

  it("not", () => {
    const nodes: AstNode[] = [
      {
        kind: "not",
        operand: {
          kind: "num",
          val: 2,
        },
      },
    ];

    const code = generateCode(nodes);
    expect(code).toEqual("++>+<[>-<[-]]");
  });

  it("pre-inc", () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual(">+<[-]>[<+>>+<-]>[-]<<+[>>+<+<-]>[<+>-]");
  });

  it("pre-dec", () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual(">+<[-]>[<+>>+<-]>[-]<<-[>>+<+<-]>[<+>-]");
  });

  it("post-inc", () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual(">+<[-]>[<+>>+<-]>[-]<<[>>+<+<-]>[<+>-]<+");
  });

  it("post-dec", () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual(">+<[-]>[<+>>+<-]>[-]<<[>>+<+<-]>[<+>-]<-");
  });

  it("equ", () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual("+>+++<[>-<-]+>[<->[-]]");
  });

  it("neq", () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual("+>+++<[>-<-]>[<+>[-]]");
  });

  it("lss", () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual(
      "+>+++<[->[>+>+<<-]>>[<<+>>-]+<[<->>-<[-]]>[<<<[-]>>>-]<<<]>[<+>[-]]",
    );
  });

  it("leq", () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual(
      "+>+++[-<[>>+>+<<<-]>>>[<<<+>>>-]+<[<<->>>-<[-]]>[<<[-]>>-]<<]+<[>-<[-]]",
    );
  });

  it("and", () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual("+>++<[>>+<<[-]]>[>+<[-]]++>[<->-]+<[>-<[-]]");
  });

  it("or", () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual("+>++<[>>+<<[-]]>[>+<[-]]>[<+>[-]]");
  });

  it("assign", () => {
    const nodes: AstNode[] = [
      {
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
    ];

    const code = generateCode(nodes);
    expect(code).toEqual(">+++<[-]>[<+>>+<-]");
  });

  it("var", () => {
    const nodes: AstNode[] = [
      {
        kind: "assign",
        lhs: {
          kind: "var",
          index: 0,
        },
        rhs: {
          kind: "num",
          val: 4,
        },
      },
      {
        kind: "var",
        index: 0,
      },
    ];

    const code = generateCode(nodes);
    expect(code).toEqual(">++++<[-]>[<+>>+<-]>[-]<<[>>+<+<-]>[<+>-]");
  });

  it("if", () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual("+>++[<+>-]<[>+.[-]<[-]]");
  });

  it("if-else", () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual("+>+[<->-]+<[>>>+.[-]<<-<[-]]>[<++.[-]>-]");
  });

  it("for", () => {
    const nodes: AstNode[] = [
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
      ">+++<[-]>[<+>>+<-]>[-]<<[>>+<+<-]>[<+>-]>[<<[>+>>+<<<-]>>>[<<<+>>>-]<<.[-]<[>+>>+<<<-]>>>[<<<+>>>-]+[<<->>-]<<<[-]>[<+>>>+<<-]>>[-]<[-]<<[>>>+<<+<-]>[<+>-]>>[<+>-]<]",
    );
  });

  it("while", () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual(
      "+[>+>+<<-]>>[<<+>>-]+++<[->[>+>+<<-]>>[<<+>>-]+<[<->>-<[-]]>[<<<[-]>>>-]<<<]>[<+>[-]]<[>>++++++[<++++++++>-]<<<[>>>+>+<<<<-]>>>>[<<<<+>>>>-]<[<+>-]<.[-]<[-]<+[>>+>+<<<-]>>>[<<<+>>>-]+++<[->[>+>+<<-]>>[<<+>>-]+<[<->>-<[-]]>[<<<[-]>>>-]<<<]>[<+>[-]]<[<+>-]<]",
    );
  });

  it("block", () => {
    const nodes: AstNode[] = [
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

    const code = generateCode(nodes);
    expect(code).toEqual(
      ">>>+<<[-]>>[<<+>>>+<-]>[-]++<<[-]>>[<<+>+>-]<<<<[-]>>>[<<<+>>>>+<-]",
    );
  });
});
