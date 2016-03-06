var fs = require('fs'),
    async = require('async'),
    readMultipleFiles = require('read-multiple-files');

var dirPath = 'sample_files/';

//------------------------------------------------------
//fs module to read multiple files using async
//Web Link=>
//------------------------------------------------------


fs.readdir(dirPath, function (err, filesPath) {
    if (err) throw err;
    filesPath = filesPath.map(function (filePath) {
        return dirPath + filePath;
    });
    async.map(filesPath, function (filePath, cb) {
        fs.readFile(filePath, 'utf8', cb);
    }, function (err, results) {
        console.log(results);
    });
});

//------------------------------------------------------
//read-multiple-files
//Web Link=> http://stackoverflow.com/questions/35823727/returning-the-content-of-multiple-files-in-node-js/35824248#35824248
//------------------------------------------------------


fs.readdir(dirPath, function (err, filesPath) {
    if (err) throw err;
    filesPath = filesPath.map(function (filePath) {
        return dirPath + filePath;
    });
    readMultipleFiles(filesPath, 'utf8', function (err, results) {
        if (err)
            throw err;
        console.log(results);
    });
});
