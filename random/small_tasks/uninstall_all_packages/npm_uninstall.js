
//------------------------------------------------------
// How to remove all npm modules listed in package.json?
// Web Link=> https://stackoverflow.com/questions/19106284/how-do-you-uninstall-all-dependencies-listed-in-package-json-npm
//------------------------------------------------------

// Option 1: bash
// > for package in `ls node_modules`; do npm uninstall $package; done;

// Option 2: shell
// > npm uninstall `ls -1 node_modules | tr '/\n' ' '`


// Note: Both work, tested on linux.

// E.g.
// Step 1: > npm init
// Step 2: > npm i uuid axios --save
// Step 3: use Option 1 or Option 2 