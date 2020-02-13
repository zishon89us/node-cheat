/**
 * Created by zeeshan on February 13, 2020.
 */

//------------------------------------------------------
//File Path - it will write to correct folder no matter where the app runs
//Web Link=> https://stackoverflow.com/questions/60208760/different-path-to-a-file
//Run :
//------------------------------------------------------

const fs = require('fs');
const {join} = require('path');

const path = process.env.NODE_ENV !== 'production'
	? join(__dirname, './main/files') // ./ means where I am right now; has main directory
	: join(__dirname, './other/files'); // that has 2 more directories files_*

/*const path = process.env.NODE_ENV !== 'production'
	? join(process.cwd(), './main/files')
	: join(process.cwd(), './other/files');*/

const randomFileName = `${path}${Date.now()}.txt`;
fs.writeFileSync(randomFileName, 'Write to main/files', 'utf-8');
