//------------------------------------------------------
//Node.js essentials
//Web Link=> 
//Run : node files
//------------------------------------------------------


// read folder and files
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
});

fs.writeFileSync(path.join(__dirname, 'sample_files', files[0]), 'Just a new line 1');

fs.appendFile(path.join(__dirname, 'sample_files', files[1]), `\nJust a new line appended`, (err, data) => {
	console.log(data);
})

