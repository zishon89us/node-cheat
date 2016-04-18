/**
 * Created by Zeeshan on 3/28/2016.
 */

//------------------------------------------------------
//Simple Express Server to download file
//Web Link=>
//------------------------------------------------------

//USING HTML

var express = require('express'),
    app = express();

var path = require('path'),
    mime = require('mime'),
    fs = require('fs');

// viewed at http://localhost:5000
app.get('/', showClientRequest, function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

//downloads file
app.get('/download', function (req, res) {

    var file = '.././sample_files/file1.txt';

    var filename = path.basename(file);
    var mimetype = mime.lookup(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
});

function showClientRequest(req, res, next) {
    var request = {
        REQUEST: {
            HEADERS: req.headers,
            BODY: req.body
        }
    }
    console.log(request)
    return next();
}

app.listen(3000);

