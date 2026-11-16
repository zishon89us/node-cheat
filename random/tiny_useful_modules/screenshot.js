//------------------------------------------------------
// Capture screenshots of websites (headless Chrome via pageres)
// Web Link=> https://github.com/sindresorhus/pageres
// Run: node screenshot.js
//------------------------------------------------------

import Pageres from 'pageres';
import path from 'node:path';

await new Pageres({ delay: 2 })
  .source('https://github.com/zishon89us/node-cheat', ['1920x1080', '1024x768'])
  .source('https://github.com/zishon89us/node-cheat', ['iphone 5s'], { crop: true })
  .destination(path.join(import.meta.dirname, 'screenshot_dest'))
  .run();

console.log('Screenshots are done!');
