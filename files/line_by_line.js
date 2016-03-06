/**
 * Created by Zeeshan on 3/6/2016.
 */



//------------------------------------------------------
//read file line by line using module tail
//Web Link=> http://stackoverflow.com/questions/35823597/nodejs-reading-line-by-line-function-while-loop/35823722#35823722
//------------------------------------------------------
/*

 var Tail = require('tail').Tail;

 var tail = new Tail("./sample_files/file1.txt");

 tail.on("line", function(data) {
 console.log(data);
 });

 tail.on("error", function(error) {
 console.log('ERROR: ', error);
 });

*/
//------------------------------------------------------
//read file line by line using module fs and async
//Web Link=> http://stackoverflow.com/questions/35823597/nodejs-reading-line-by-line-function-while-loop/35823722#35823722
//------------------------------------------------------


    var readline = require('linebyline'),
        rl = readline('./sample_files/file1.txt');
    rl.on('line', function (line, lineCount, byteCount) {
        console.log(lineCount, line, byteCount);
        // do something with the line of text
    })
    .on('error', function (e) {
            console.log("error", e);
        // something went wrong
    });