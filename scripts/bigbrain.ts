import fs from "fs/promises";
import { compile } from "../src";

async function main(): Promise<void> {
  const path = process.argv[2];

  if (path === undefined) {
    console.error("Usage: yarn bigbrain <path>");
    process.exit(0);
  }

  const src = await fs.readFile(path, "utf-8");
  const code = compile(src);

  console.log(code);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
