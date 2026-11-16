//------------------------------------------------------
// Node.js essentials: process.stdout & process.stdin to write to and read from the terminal
// Run: node stdout-stdin.js
//------------------------------------------------------

const questions = ['What is your name?', 'How are you?'];
const answers = [];

const ask = (index) => process.stdout.write(`\n ${questions[index]} > `);

process.on('exit', () => console.log('\n All done.'));

process.stdin.setEncoding('utf-8');
ask(0);

// stdin is an async iterable stream; one chunk can hold several lines when input is piped
let buffered = '';
outer: for await (const chunk of process.stdin) {
  buffered += chunk;
  let newline;
  while ((newline = buffered.indexOf('\n')) !== -1) {
    const answer = buffered.slice(0, newline).trim();
    buffered = buffered.slice(newline + 1);
    answers.push(answer);
    process.stdout.write(` Your answer: ${answer}`);
    if (answers.length === questions.length) break outer;
    ask(answers.length);
  }
}

console.log('\n', Object.fromEntries(questions.map((q, i) => [q, answers[i]])));
process.exit();
