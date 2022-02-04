import { generateCode } from "./code";
import { parse } from "./parse";
import { tokenize } from "./tokenize";

export function compile(src: string): string {
  const tokens = tokenize(src);
  const nodes = parse(tokens);
  const code = generateCode(nodes);
  return code;
}
