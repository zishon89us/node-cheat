/**
 * Created by Zeeshan on 3/28/2016.
 */

//------------------------------------------------------
//Simple Express Server to send html file to client
//Web Link=> http://stackoverflow.com/questions/36258158/expressjs-view-helpers-do-not-work/36258354#36258354
//------------------------------------------------------

//USING HTML
/*

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

*/


//USING EJS TEMPLATE ENGINE
var express = require('express');
var path = require('path');
var ejs = require('ejs');
var app = express();

app.use(express.static( path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

var path = require('path');

// viewed at http://localhost:5000
app.get('/', showClientRequest, function(req, res) {
    res.render('index',{message:"Hello World!"});
});

function showClientRequest(req, res, next) {
    console.log('Something Here...');
    return next();
}

app.listen(5000);
