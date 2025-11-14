/**
 * Created by Zeeshan on March 27, 2018.
 */

//------------------------------------------------------
//LATEST-ANSWER @ March-2018 [ES8 STYLE]
//multi-part direct upload to s3 without saving on local disk
//Web Link=> http://stackoverflow.com/a/35902286/3539857
//OTHER IMPLEMENTATIONS=> see app.js in current directory
//Run : node app.js
//------------------------------------------------------

const express = require('express'); //"^4.13.4"
const aws = require('aws-sdk'); //"^2.2.41"
const bodyParser = require('body-parser');
const multer = require('multer'); // "^1.3.0"
const multerS3 = require('multer-s3'); //"^2.7.0"

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET_ACCESS_KEY',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'YOUR_ACCESS_KEY_ID',
    region: process.env.AWS_REGION || 'us-east-1'
});

const app = express();
const s3 = new aws.S3();

app.use(bodyParser.json());

const upload = multer({
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

//open http://localhost:3000/ in browser to see upload form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

//used by upload form
app.post('/upload', upload.array('upl', 25), (req, res, next) => {
		res.send({
			message: "Uploaded!",
			urls: req.files.map(function(file) {
				return {url: file.location, name: file.key, type: file.mimetype, size: file.size};
			})
		});
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});


//------------------------------------------------------
//NEW-ANSWER @ DEC-2016 [ES5 STYLE]
//------------------------------------------------------

/* SEE app.js in current directory Line#13*/
