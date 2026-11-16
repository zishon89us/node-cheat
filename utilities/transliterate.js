// Transliterate unicode to ASCII and build URL slugs
// Run: node utilities/transliterate.js

import { transliterate as tr, slugify } from 'transliteration';

console.log(tr('ABC ©')); // ABC (c)

const cleaned = tr('ABC®: 123©').replace(/\((r|c)\)/gi, '');
console.log(cleaned); // ABC: 123

console.log(slugify(cleaned, { lowercase: true, separator: '-' })); // abc-123
console.log(slugify('你好, world!')); // ni-hao-world
