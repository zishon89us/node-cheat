//------------------------------------------------------
//Node.js essentials
//Web Link=> 
//Run : node streams
//------------------------------------------------------

// streams interface provides us with the technique to read and write data 
// to/from files, internet or other processes etc..

const fs = require('fs');
const path = require('path');

const readStream = fs.createReadStream(path.join(__dirname, 'sample_files', 'file1.txt'), 'utf-8');

readStream.on('data', data => {
	console.log(`File chunck ${data.length} length read.`);
});

// readStream.once('data', data => {
// 	console.log(data);
// });

readStream.on('end', data => {
	console.log(`File reading complete.`);
});