/**
 * Created by Zeeshan on 3/9/2016.
 */

//------------------------------------------------------
//multi-part direct upload to s3 without saving on local disk
//Web Link=> https://github.com/expressjs/multer/issues/196
//Run : node app.js
//------------------------------------------------------

var express = require('express'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    s3 = require('multer-s3');

var app = express();

app.use(bodyParser.json());

var upload = multer({
    storage: s3({
        dirname: '/',
        bucket: 'bucket-name',
        secretAccessKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        accessKeyId: 'XXXXXXXXXXXXXXX',
        region: 'us-east-1',
        filename: function (req, file, cb) {
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    })
});

//open in browser to see upload form
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

//use by upload form
app.post('/upload', upload.array('upl'), function (req, res, next) {
    res.send("Uploaded!");
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});