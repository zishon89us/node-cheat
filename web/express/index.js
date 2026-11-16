// Run another program from Node.js safely (cross-platform, no shell).
// Run: node web/express/index.js

import { execFile, spawn } from 'node:child_process';
import { join } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

// Option 1: buffered output — arguments are passed as an array, never interpolated into a shell string
const { stdout } = await execFileAsync(process.execPath, ['--version']);
console.log('Node version:', stdout.trim());

// Option 2: streamed output for long-running processes
const child = spawn(process.execPath, [join(import.meta.dirname, 'app.js'), 'a', 'b', 'c'], {
  stdio: 'inherit',
});
setTimeout(() => child.kill(), 2000);
child.on('exit', (code, signal) => console.log(`Child exited (code=${code}, signal=${signal})`));
