/**
 * Created by Zeeshan on April 11, 2018.
 */

//------------------------------------------------------
//Download YouTube video
//Web Link=> https://stackoverflow.com/questions/49770196/nodejs-youtube-spawn-unknown-error/49771147#49771147
//Run : node download_script.js
//------------------------------------------------------

const fs = require('fs');
const youTube = require('youtube-dl');
const video = youTube('http://www.youtube.com/watch?v=90AiXO1pAiA');

// called when the download starts.
video.on('info', function(info) {
	console.log('Download started');
	console.log('filename: ' + info.filename);
	console.log('size: ' + info.size);
});

video.pipe(fs.createWriteStream('downloads/downloaded_video.mp4'));

/* 	Sample Output 	*/
/*
	Download started
	filename: lol-90AiXO1pAiA.webm
	size: 1029843
	NOTE: File will be downloaded in downloads folder
*/