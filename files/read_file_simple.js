//------------------------------------------------------
//fs module to read file in sync and async way
//Web Link=>
//------------------------------------------------------

const fs = require('fs');
const { promisify } = require('util');
const filePath = './sample_files/file1.txt';

//--------------Async/Await-Style-----------------------
const readFile = promisify(fs.readFile);
async function main() {
    const data = await readFile(filePath, 'utf8');
    console.log(data);
}

main();

//--------------Callback-Style--------------------------

/*fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
});*/

