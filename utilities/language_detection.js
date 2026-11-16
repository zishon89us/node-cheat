//------------------------------------------------------
// Detect the language of a text (ISO 639-3 codes)
// Web Link=> https://github.com/wooorm/franc
// Run: node language_detection.js
//------------------------------------------------------

import { franc, francAll } from 'franc';

console.log(franc('This text is simply written in English to find its language.')); // eng
console.log(franc('Ce texte est tout simplement écrit en français pour trouver sa langue.')); // fra
console.log(franc('یہ متن صرف اس زبان تلاش کرنے کے لیے اردو میں لکھا ہوا ہے')); // urd
console.log(franc('short')); // und: too short to tell

// Ranked candidates, optionally restricted to the languages you care about
console.log(francAll('O Brasil caiu 26 posições', { only: ['por', 'spa', 'glg'] }).slice(0, 3));
