import Brainfuck from "brainfuck-node";

import { compile } from "../src/bigbrain";

const bf = new Brainfuck({
  maxSteps: 1_000_000_000,
});

describe("compile", () => {
  test("fizzbuzz", () => {
    const code = compile(`
x = input() * 2;
for (i = 1; i <= x; ++i) {
  if (i % 3 == 0 && i % 5 == 0) {
    putchar(102);
    putchar(105);
    putchar(122);
    putchar(122);
    putchar(98);
    putchar(117);
    putchar(122);
    putchar(122);
  } else if (i % 3 == 0) {
    putchar(102);
    putchar(105);
    putchar(122);
    putchar(122);
  } else if (i % 5 == 0) {
    putchar(98);
    putchar(117);
    putchar(122);
    putchar(122);
  } else {
    print(i);
  }
  putchar(10);
}
`);

    const result = bf.execute(code, "2");

    expect(result.output).toBe(
      `1
2
fizz
4
buzz
fizz
7
8
fizz
buzz
11
fizz
13
14
fizzbuzz
16
17
fizz
19
buzz
fizz
22
23
fizz
buzz
26
fizz
28
29
fizzbuzz
31
32
fizz
34
buzz
fizz
37
38
fizz
buzz
41
fizz
43
44
fizzbuzz
46
47
fizz
49
buzz
fizz
52
53
fizz
buzz
56
fizz
58
59
fizzbuzz
61
62
fizz
64
buzz
fizz
67
68
fizz
buzz
71
fizz
73
74
fizzbuzz
76
77
fizz
79
buzz
fizz
82
83
fizz
buzz
86
fizz
88
89
fizzbuzz
91
92
fizz
94
buzz
fizz
97
98
fizz
buzz
`,
    );
  });

  test("if-else expression", () => {
    const code = compile(`
in = input();

x = if (in == 65) {
  1
} else if (in == 66) {
  2
} else {
  3
};

print(x);
`);

    const tests = [
      ["A", "1"],
      ["B", "2"],
      ["C", "3"],
    ];

    tests.forEach(([input, expected]) => {
      const { output } = bf.execute(code, input);
      expect(output).toBe(expected);
    });
  });
});
