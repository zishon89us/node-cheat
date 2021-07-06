//------------------------------------------------------
//Node.js essentials
//Web Link=> 
//Run : node files
//------------------------------------------------------


// read folder and file
const fs = require('fs');
const path = require('path');
const files = fs.readdirSync('./sample_files');

console.log(files);
files.map(file => {
	fs.readFile(path.join(__dirname, 'sample_files', file), 'utf-8', (err, text) => {
		if (err) {
			console.log('Error ', err);
		}
		console.log(text);
	})
})

