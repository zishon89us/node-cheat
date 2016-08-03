/**
 * Created by Zeeshan on 8/3/2016.
 */

//------------------------------------------------------
//https basic node.js server
//Web Link=> https://docs.nodejitsu.com/articles/HTTP/servers/how-to-create-a-HTTPS-server/
//Run : node server.js
//Note : See Web Link to generate keys
//------------------------------------------------------

var https = require('https'),
    fs = require('fs'),
    app = require('express')();

var options = {
    key: fs.readFileSync('../keys/key.pem'),
    cert: fs.readFileSync('../keys/cert.pem')
};

app.get('/', function (req, res) {
    res.send('Hello World!');
});

https.createServer(options, app).listen(3000, function () {
    console.log('Server Started!');
});