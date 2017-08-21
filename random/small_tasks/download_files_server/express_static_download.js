/**
 * Created by Zeeshan on 8/20/2017.
 */

//------------------------------------------------------
//Simple Express Server to download files
//Web Link=>
//------------------------------------------------------

var express = require('express'),
      path = require('path');

app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.send('Open: http://localhost:3000/file2.txt');
});

app.listen(3000, function(){
    console.log('Listening on 3000');
});