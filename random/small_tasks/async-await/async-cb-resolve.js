/**
 * Created by Zeeshan on 02/26/2018.
 */

//------------------------------------------------------
//async function to resolve value based on callback style
//Web Link=>
//------------------------------------------------------

const fs = require('fs');
const promisify = require("es6-promisify");
const readFileFn = promisify(fs.readFile);

const filePath2 = "./files/file2.txt";

const readAsync = async () => {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath2, 'utf-8', function(err, data){
			resolve(data);
		});
	});
};

const main = async () => {
	// Style 1
	fs.readFile(filePath2, 'utf-8', function(err, data){
	 console.log(`Style 1 : ${data}`);
	 });

	// Style 2
	readFileFn(filePath2, 'utf-8').then(function(data){
		console.log(`Style 2 : ${data}`);
	});

	// Style 3
	const data = await readFileFn(filePath2, 'utf-8');
	console.log(`Style 3 : ${data}`);

	// Style 4
      const data1 = await readAsync();
	console.log(`Style 3 : ${data1}`);
}

main();