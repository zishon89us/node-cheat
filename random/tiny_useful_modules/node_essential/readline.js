//------------------------------------------------------
//Node.js essentials
//Web Link=> 
//Run : node readline
//------------------------------------------------------


// readline to collection user input
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.question('what is your name?', answer => console.log('alright, thanks!'));
