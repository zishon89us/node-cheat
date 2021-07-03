//------------------------------------------------------
//Node.js essentials
//Web Link=> 
//Run : node global
//------------------------------------------------------


// access global object's values anywhere
console.log('I am console.log');
global.console.log('I am global.console.log');

// how to get current file name
const path = require('path');

console.log(__dirname);
console.log(__filename);
console.log(`This is file name only ${path.basename(__filename)}`);