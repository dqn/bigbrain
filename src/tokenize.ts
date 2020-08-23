// must sort them in order of increasing string length for lexical analysis.
const symbols = [
  '==',
  '!=',
  '<=',
  '>=',
  '&&',
  '||',
  '++',
  '--',
  '+',
  '-',
  '*',
  '/',
  '%',
  '(',
  ')',
  ';',
  '=',
  '<',
  '>',
  '!',
  '{',
  '}',
] as const;

const builtInFunctions = ['input', 'putchar', 'print'] as const;

const controlStructures = ['if', 'else', 'for'] as const;

export type ReservedWord =
  | typeof symbols[number]
  | typeof builtInFunctions[number]
  | typeof controlStructures[number];

export type Token =
  | {
      kind: 'eof';
    }
  | {
      kind: 'reserved';
      str: ReservedWord;
    }
  | {
      kind: 'ident';
      str: string;
    }
  | {
      kind: 'num';
      val: number;
    };

export function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let cur = src;

  const next = (num: number): string => {
    return cur.slice(0, num);
  };

  const strshift = (num: number): string => {
    const s = cur.slice(0, num);
    cur = cur.slice(num);
    return s;
  };

  const consume = (str: string): boolean => {
    if (next(str.length) === str && !/\w/.test(cur[str.length])) {
      strshift(str.length);
      return true;
    }

    return false;
  };

  while (cur) {
    if (/\s/.test(next(1))) {
      strshift(1);
      continue;
    }

    const symbol = symbols.find((sym) => next(sym.length) === sym);
    if (symbol) {
      strshift(symbol.length);
      tokens.push({ kind: 'reserved', str: symbol });
      continue;
    }

    const builtInFunction = builtInFunctions.find((func) => consume(func));
    if (builtInFunction) {
      tokens.push({ kind: 'reserved', str: builtInFunction });
      continue;
    }

    const controlStructure = controlStructures.find((struct) => consume(struct));
    if (controlStructure) {
      tokens.push({ kind: 'reserved', str: controlStructure });
      continue;
    }

    if (/[a-z_]/.test(next(1))) {
      let str = '';

      while (/\w/.test(next(1))) {
        str += strshift(1);
      }

      tokens.push({ kind: 'ident', str });
      continue;
    }

    const val = parseInt(cur);
    if (!isNaN(val)) {
      strshift(val.toString().length);
      tokens.push({ kind: 'num', val });
      continue;
    }

    throw new Error(`unknown token ${cur.slice(0, 10)}...`);
  }

  tokens.push({ kind: 'eof' });

  return tokens;
}
