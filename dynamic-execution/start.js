
const fs = require('fs');
const path = require('path');
const dirPath = './files';

const _files = fs.readdirSync(path.resolve(__dirname, dirPath));
_files.forEach(f => {
   require(path.resolve(__dirname, dirPath, f)).init();
});