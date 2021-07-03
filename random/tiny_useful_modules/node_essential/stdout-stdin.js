//------------------------------------------------------
//Node.js essentials
//Web Link=> 
//Run : node stdout-stdin
//------------------------------------------------------

// process.stdout & process.stdin to write to and read from terminal

const questions = ['what is your name?', 'how are you?'];
const answers = [];

const ask = (question=0) => {
	process.stdout.write(`\n ${questions[question]}`);
	process.stdout.write(` > `);	
}

process.stdin.on('data', data => {
	process.stdout.write(` Your answer: ${data.toString().trim()}`);
	answers.push(data);
	if (answers.length === questions.length) {
		process.stdout.write(`\n\n`);
		process.exit();
	}
	ask(answers.length)
});
ask();

process.on('exit', ()=> {
	console.log(' All done..');
});