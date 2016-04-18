/**
 * Created by Zeeshan on 3/28/2016.
 */

//------------------------------------------------------
//Simple Express Server to send html file to client
//Web Link=> http://stackoverflow.com/questions/36258158/expressjs-view-helpers-do-not-work/36258354#36258354
//------------------------------------------------------

//USING HTML

var express = require('express'),
    app = express();

var path = require('path'),
    mime = require('mime'),
    fs = require('fs');

// viewed at http://localhost:5000
app.get('/', showClientRequest, function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});



app.get('/download', function(req, res){

    //var file = __dirname + '/upload-folder/dramaticpenguin.MOV';
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
        REQUEST : {
            HEADERS: req.headers,
            BODY : req.body
        }
    }
    console.log(request)
    return next();
}

app.listen(3000);

