// must sort them in order of increasing string length for lexical analysis.
const symbols = [
  "==",
  "!=",
  "<=",
  ">=",
  "&&",
  "||",
  "++",
  "--",
  "**",
  "+",
  "-",
  "*",
  "/",
  "%",
  "(",
  ")",
  ";",
  "=",
  "<",
  ">",
  "!",
  "{",
  "}",
] as const;

const builtinFunctions = ["input", "putchar", "print"] as const;
const controlStatements = ["if", "else", "for", "while"] as const;

export type ReservedWord =
  | typeof symbols[number]
  | typeof builtinFunctions[number]
  | typeof controlStatements[number];

export type Token =
  | {
      kind: "eof";
    }
  | {
      kind: "reserved";
      str: ReservedWord;
    }
  | {
      kind: "ident";
      str: string;
    }
  | {
      kind: "num";
      val: number;
    };

export function tokenize(src: string): Token[] {
  let cur = src;
  const tokens: Token[] = [];

  const next = (num: number): string => {
    return cur.slice(0, num);
  };

  const strshift = (num: number): string => {
    const s = cur.slice(0, num);
    cur = cur.slice(num);
    return s;
  };

  const consume = (str: string): boolean => {
    return next(str.length) === str && (strshift(str.length), true);
  };

  while (cur !== "") {
    if (/\s/.test(next(1))) {
      strshift(1);
      continue;
    }

    if (next(2) === "//") {
      while (next(1) !== "\n") {
        strshift(1);
      }
      continue;
    }

    const symbol = symbols.find(consume);
    if (symbol !== undefined) {
      tokens.push({ kind: "reserved", str: symbol });
      continue;
    }

    const builtinFunction = builtinFunctions.find(consume);
    if (builtinFunction !== undefined) {
      tokens.push({ kind: "reserved", str: builtinFunction });
      continue;
    }

    const controlStatement = controlStatements.find(consume);
    if (controlStatement !== undefined) {
      tokens.push({ kind: "reserved", str: controlStatement });
      continue;
    }

    if (/[a-z_]/i.test(next(1))) {
      let str = "";

      while (/\w/.test(next(1))) {
        str += strshift(1);
      }

      tokens.push({ kind: "ident", str });
      continue;
    }

    const val = parseInt(cur);
    if (!Number.isNaN(val)) {
      strshift(val.toString().length);
      tokens.push({ kind: "num", val });
      continue;
    }

    throw new Error(`unknown token ${cur.slice(0, 10)}...`);
  }

  tokens.push({ kind: "eof" });

  return tokens;
}
