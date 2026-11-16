//------------------------------------------------------
// How to remove all npm modules listed in package.json?
// Web Link=> https://stackoverflow.com/questions/19106284/how-do-you-uninstall-all-dependencies-listed-in-package-json-npm
//------------------------------------------------------

// Option 1 (simplest): delete installed modules; `npm ci` restores them from the lockfile
// > rm -rf node_modules

// Option 2: uninstall each top-level dependency and drop it from package.json
// > npm uninstall $(node -p "Object.keys(require('./package.json').dependencies ?? {}).join(' ')")

// Option 3: same, using npm's JSON output
// > npm ls --depth=0 --json | node -e "process.stdin.on('data', d => console.log(Object.keys(JSON.parse(d).dependencies ?? {}).join(' ')))" | xargs npm uninstall
