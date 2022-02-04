declare module "brainfuck-node" {
  class Result {
    public output: string;
  }

  type BrainfuckOptions = { maxSteps?: number };

  export default class Brainfuck {
    constructor(options: BrainfuckOptions = {});
    execute(code: string, input: string = ""): Result;
  }
}
