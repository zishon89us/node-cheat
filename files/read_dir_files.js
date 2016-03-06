var fs = require('fs'),
    async = require('async');

var dirPath = 'sample_files/';

fs.readdir(dirPath, function (err, filesPath) {
    if (err) throw err;
    filesPath = filesPath.map(function(filePath){
        return dirPath + filePath;
    });
    async.map(filesPath, function(filePath, cb){
        fs.readFile(filePath, 'utf8', cb);
    }, function(err, results) {
        console.log(results);
    });
});
