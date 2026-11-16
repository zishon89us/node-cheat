//------------------------------------------------------
// Node.js essentials: readline to collect user input
// Run: node readline.js
//------------------------------------------------------

import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

const name = await rl.question('What is your name? ');
console.log(`Alright, thanks ${name.trim() || 'stranger'}!`);

rl.close();
