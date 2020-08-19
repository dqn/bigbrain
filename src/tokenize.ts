export type Token =
  | {
      kind: 'eof';
    }
  | {
      kind: 'reserved';
      str: string;
    }
  | {
      kind: 'print';
    }
  | {
      kind: 'if';
    }
  | {
      kind: 'else';
    }
  | {
      kind: 'for';
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

    if (['==', '!=', '<=', '>=', '++', '--'].includes(next(2))) {
      tokens.push({ kind: 'reserved', str: strshift(2) });
      continue;
    }

    if (['+', '-', '*', '/', '(', ')', ';', '=', '<', '>'].includes(next(1))) {
      tokens.push({ kind: 'reserved', str: strshift(1) });
      continue;
    }

    if (consume('print')) {
      tokens.push({ kind: 'print' });
      continue;
    }

    if (consume('if')) {
      tokens.push({ kind: 'if' });
      continue;
    }

    if (consume('else')) {
      tokens.push({ kind: 'else' });
      continue;
    }

    if (consume('for')) {
      tokens.push({ kind: 'for' });
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
