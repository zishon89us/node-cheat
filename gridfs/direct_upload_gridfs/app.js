/**
 * Created by Zeeshan on 3/26/2016.
 * Last updated by Zeeshan on 02/25/2018.
 */

//------------------------------------------------------
//direct upload to GridFS without saving on local disk
//Stack: node.js express mongoDB GridFS
//Run : node app.js
//Web Link=> http://stackoverflow.com/questions/20860005/storing-data-stream-from-post-request-in-gridfs-express-mongodb-node-js
//Web Link 2=> https://github.com/aheckmann/gridfs-stream
//NOTE: README.md contains ALL INSTRUCTIONS
//------------------------------------------------------


var express = require('express'),
    mongo = require('mongodb'),
    Grid = require('gridfs-stream'),
    db = new mongo.Db('node-cheat-db', new mongo.Server("localhost", 27017)),
    gfs = Grid(db, mongo),
    app = express();

db.open(function (err) {
    if (err) return handleError(err);
    var gfs = Grid(db, mongo);
    console.log('All set! Start uploading :)');
});

//POST http://localhost:3000/file
app.post('/file', function (req, res) {
    var writeStream = gfs.createWriteStream({
        filename: 'file_name_here'
    });
    writeStream.on('close', function (file) {
        res.send(`File has been uploaded ${file._id}`);
    });
    req.pipe(writeStream);
});

//GET http://localhost:3000/file/[mongo_id_of_file_here]
app.get('/file/:fileId', function (req, res) {
    gfs.createReadStream({
        _id: req.params.fileId // or provide filename: 'file_name_here'
    }).pipe(res);
});

app.listen(process.env.PORT || 3000);