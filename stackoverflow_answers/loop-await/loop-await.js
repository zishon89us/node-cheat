
async function myfunction (thing1, thing2, thing3) {
	// perform your operations here
	return 'done'; // return your results like object or string or whatever
}

const fs = require('fs');
const file = fs.readFileSync('file.txt').toString().split("\n");

// This main function is just a wrapper to initialize code
async function main() {
	for(i in file) {
	    let [thing1, thing2, thing3] = file[i].split(":");
	    let result = await myfunction(thing1, thing2, thing3);
			console.log(`Result of ${i} returned`);
	}
}

main();
