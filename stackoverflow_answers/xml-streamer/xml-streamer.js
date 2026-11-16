import { createReadStream } from 'node:fs';

export async function readStream(file) {
  let data = '';
  for await (const chunk of createReadStream(file, { encoding: 'utf8' })) {
    data += chunk;
  }
  return data;
}
