//------------------------------------------------------
// How to remove all npm modules installed globally?
// Web Link=> https://stackoverflow.com/questions/9283472/command-to-remove-all-npm-modules-globally/19357869
//------------------------------------------------------

// List global packages (excluding npm itself) and uninstall them:
// > npm ls -g --depth=0 --parseable | tail -n +2 | xargs -n1 basename | grep -vx npm | xargs npm uninstall -g

// Scoped packages (@scope/name) need the scope kept:
// > npm ls -g --depth=0 --json | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(Object.keys(JSON.parse(s).dependencies).filter(n=>n!=='npm').join(' ')))" | xargs npm uninstall -g
