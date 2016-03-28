/**
 * Created by Zeeshan on 3/28/2016.
 */

//------------------------------------------------------
//Simple Express Server to send html file to client
//Web Link=> http://stackoverflow.com/questions/36258158/expressjs-view-helpers-do-not-work/36258354#36258354
//------------------------------------------------------


var express = require('express');
var app = express();
var path = require('path');

// viewed at http://localhost:5000
app.get('/', showClientRequest, function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
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

app.listen(5000);