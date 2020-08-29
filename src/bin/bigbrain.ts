#!/usr/bin/env node

import fs from 'fs';
import meow from 'meow';

import { compile } from '../';

const cli = meow(
  `Usage
  $ bigbrain <source-file-path>
Examples
  $ bigbrain -c "<source-code>"`,
  {
    flags: {
      cmd: {
        type: 'string',
        alias: 'c',
      },
    },
  },
);

if (cli.input.length === 1 && cli.input[0]) {
  const src = fs.readFileSync(cli.input[0], { encoding: 'utf-8' });
  console.log(compile(src));
  process.exit(0);
}

if (cli.flags.cmd) {
  console.log(compile(cli.flags.cmd));
  process.exit(0);
}

cli.showHelp();
