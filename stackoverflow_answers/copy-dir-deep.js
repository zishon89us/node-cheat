
//------------------------------------------------------
//Copy Files Recursivly - it will copy recursively without using any extra package
//Web Link=> https://stackoverflow.com/questions/60304937/nodejs-move-multiple-files-from-nested-folders-into-other-folder/60305349#60305349
//Run :
//------------------------------------------------------

const fs = require('fs');
const path = require('path');

const mkdir = (dir) => {
	try {
		fs.mkdirSync(dir, 0755);
	} catch(e) {
		if(e.code != "EEXIST") {
			throw e;
		}
	}
};

const copy = (src, dest) => {
	let oldFile = fs.createReadStream(src);
	let newFile = fs.createWriteStream(dest);
	oldFile.pipe(newFile);
};

const copyDir = (src, dest) => {
	mkdir(dest);
	const files = fs.readdirSync(src);
	for(var i = 0; i < files.length; i++) {
		const current = fs.lstatSync(path.join(src, files[i]));
		if(current.isDirectory()) {
			copyDir(path.join(src, files[i]), path.join(dest, files[i]));
		} else if(current.isSymbolicLink()) {
			const symlink = fs.readlinkSync(path.join(src, files[i]));
			fs.symlinkSync(symlink, path.join(dest, files[i]));
		} else {
			copy(path.join(src, files[i]), path.join(dest, files[i]));
		}
	}
};


copyDir('a', 'b');
