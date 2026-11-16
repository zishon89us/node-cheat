// Read a file line by line with node:readline (no dependencies, constant memory)
// Web Link=> https://nodejs.org/api/readline.html#example-read-file-stream-line-by-line
// Run: node files/line_by_line.js

import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { join } from 'node:path';

const filePath = join(import.meta.dirname, 'sample_files', 'file1.txt');

const rl = createInterface({ input: createReadStream(filePath), crlfDelay: Infinity });

let lineCount = 0;
for await (const line of rl) {
  lineCount += 1;
  console.log(lineCount, line);
}

// To follow a growing file (like `tail -f`), use fs.watch or the `tail` package.
