//------------------------------------------------------
//Node.js essentials
//Web Link=> 
//Run : node process
//------------------------------------------------------


// process object holds current process information
console.log(`PID: ${process.pid} Node -V: ${process.versions.node}`);

const getArgvFlag = flag => {
	const flagValueIndex = process.argv.indexOf(flag) + 1;
	return process.argv[flagValueIndex];
}

const a = getArgvFlag('--a');
const b = getArgvFlag('--b');
console.log(`This is value of flag A: ${a} & flag B: ${b}`);