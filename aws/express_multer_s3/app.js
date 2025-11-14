/**
 * Created by Zeeshan on 3/9/2016.
 * Last updated on March 4, 2022.
 */

//------------------------------------------------------
//UPDATED-ANSWER @ MAR-2022 [ES5 STYLE]
//multi-part direct upload to s3 without saving on local disk
//Web Link=> http://stackoverflow.com/a/35902286/3539857
//Run : node app.js
//------------------------------------------------------

var express = require('express'), // "^4.13.4"
    aws = require('aws-sdk'), // ^2.2.41
    bodyParser = require('body-parser'),
    multer = require('multer'), // "multer": "^1.1.0"
    multerS3 = require('multer-s3'); //"^1.4.1"

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET_ACCESS_KEY',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'YOUR_ACCESS_KEY_ID',
    region: process.env.AWS_REGION || 'us-east-1'
});

var app = express(),
    s3 = new aws.S3();

app.use(bodyParser.json());

var upload = multer({
    storage: multerS3({
        s3: s3,
				acl: 'public-read',
        bucket: 'node-cheat',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    })
});

//open in browser to see upload form
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

//used by upload form
app.post('/upload', upload.array('upl', 25), function (req, res, next) {
    res.send({
			message: "Uploaded!",
			urls: req.files.map(function(file) {
				return {url: file.location, name: file.key, type: file.mimetype, size: file.size};
			})
		});
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

// ------------------------------------------------------
// OLD-ANSWER
//multi-part direct upload to s3 without saving on local disk
//Web Link=> https://github.com/expressjs/multer/issues/196
//Run : node app.js
//NOTE ::: use multer@1.1.0 and multer-s3@1.4.1 for following snippet:
//------------------------------------------------------

/*
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
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET_ACCESS_KEY',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'YOUR_ACCESS_KEY_ID',
        region: process.env.AWS_REGION || 'us-east-1',
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
});*/
