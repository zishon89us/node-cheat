
//------------------------------------------------------
// How to remove all npm modules globally?
// Web Link=> https://stackoverflow.com/questions/9283472/command-to-remove-all-npm-modules-globally/19357869
//------------------------------------------------------

// > npm ls -gp --depth=0 | awk -F/ '/node_modules/ && !/\/npm$/ {print $NF}' | xargs npm -g rm