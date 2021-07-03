//------------------------------------------------------
//Node.js essentials
//Web Link=> 
//Run : node settimeout
//------------------------------------------------------

// settimeout
const waitTime = 5000;
const waitInterval = 500;
let currentTime = 0;

const incTime = inc => {
	currentTime += waitInterval;
	const p = Math.floor((currentTime / waitTime) * 100);
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	process.stdout.write(`Progress ${p}%`);
}

const cb = () => {
	clearInterval(interval);
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	process.stdout.write(`All done \n`)
};

setTimeout(cb, waitTime);
const interval = setInterval(incTime, waitInterval)
































