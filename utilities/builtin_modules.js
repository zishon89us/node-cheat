//------------------------------------------------------
// List Node.js core modules (no dependency needed)
// Web Link=> https://nodejs.org/api/module.html#modulebuiltinmodules
// Run: node builtin_modules.js
//------------------------------------------------------

import { builtinModules, isBuiltin } from 'node:module';

console.log(builtinModules.filter((name) => !name.startsWith('_')));

console.log(isBuiltin('fs'), isBuiltin('node:test'), isBuiltin('express')); // true true false
