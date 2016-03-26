/**
 * Created by Zeeshan on 3/26/2016.
 */

//------------------------------------------------------
//direct upload to GridFS without saving on local disk
//Stack: node.js express mongoDB GridFS
//Run : node app.js
//Web Link=> http://stackoverflow.com/questions/20860005/storing-data-stream-from-post-request-in-gridfs-express-mongodb-node-js
//Web Link 2=> https://github.com/aheckmann/gridfs-stream
//------------------------------------------------------


var express = require('express'),
    mongo = require('mongodb'),
    Grid = require('gridfs-stream'),
    db = new mongo.Db('yourDatabaseName', new mongo.Server("127.0.0.1", 27017)),
    gfs = Grid(db, mongo),
    app = express();

app.post('/picture', function(req, res) {
    req.pipe(gfs.createWriteStream({
        filename: 'test'
    }));
    res.send("Success!");
});

app.listen(process.env.PORT || 3413);
