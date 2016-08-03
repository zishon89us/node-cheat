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
    fs = require('fs');

var options = {
    key: fs.readFileSync('../keys/key.pem'),
    cert: fs.readFileSync('../keys/cert.pem')
};

var a = https.createServer(options, function (req, res) {
    res.writeHead(200);
    res.end("hello world\n");
}).listen(8000);