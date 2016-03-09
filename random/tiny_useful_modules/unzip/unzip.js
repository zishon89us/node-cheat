/**
 * Created by Zeeshan on 3/9/2016.
 */


//------------------------------------------------------
//extract zip contents and read
//Web Link=>
//------------------------------------------------------


var AdmZip = require('adm-zip');


/*var zip = new AdmZip("./sample_files.zip");
var zipEntries = zip.getEntries(); // an array of ZipEntry records

zipEntries.forEach(function (zipEntry) {
    //read data as text
    console.log(zip.readAsText(zipEntry));
    //extract to target folder
    if (zipEntry.entryName == "sample_files/file2.txt") {
        zip.extractEntryTo(*//*entry name*//*zipEntry.entryName, *//*target path*//*__dirname+"/sample_output_s", *//*maintainEntryPath*//*false, *//*overwrite*//*true);
    }
});*/

//------------------------------------------------------
//access zip folder contents on the fly
//Web Link=>
//------------------------------------------------------

/*var request = require('request');
var fs = require('fs');
var AdmZip = require('adm-zip');
var http = require('http');
var url = require('url');
var zipFileUrl = "http://www.colorado.edu/conflict/peace/download/peace.zip";

var options = {
    host: url.parse(zipFileUrl).host,
    port: 80,
    path: url.parse(zipFileUrl).pathname
};

http.get(options, function(res) {
    var data = [], dataLen = 0;

    res.on('data', function(chunk) {

        data.push(chunk);
        dataLen += chunk.length;

    }).on('end', function() {
        var buf = new Buffer(dataLen);

        for (var i=0, len = data.length, pos = 0; i < len; i++) {
            data[i].copy(buf, pos);
            pos += data[i].length;
        }

        var zip = new AdmZip(buf);
        var zipEntries = zip.getEntries();
        console.log(zipEntries.length)

        for (var i = 0; i < zipEntries.length; i++)
            console.log(zip.readAsText(zipEntries[i]));
    });
});*/

//------------------------------------------------------
//download zip and save it option 1
//Web Link=>
//------------------------------------------------------

var request = require('request');
var fs = require('fs');

var fileUrl = "http://twitter.github.com/bootstrap/assets/bootstrap.zip";
var output = "bootstrap.zip";
/*request({url: fileUrl, encoding: null}, function(err, resp, body) {
    if(err) throw err;
    fs.writeFile(output, body, function(err) {
        console.log("file written!");
    });
});*/

//------------------------------------------------------
//download zip and save it option 2
//Web Link=>
//------------------------------------------------------

request({url: fileUrl, encoding: null})
    .pipe(fs.createWriteStream(output))
    .on('close', function () {
        console.log('File written!');
    });