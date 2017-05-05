/**
 * Created by Zeeshan on 5/5/2017.
 */

//------------------------------------------------------
//Simple Express Server to restrict static files
//Web Link=>
//------------------------------------------------------

var express = require('express'),
    path = require('path');
    app = express();

app.use(function(req, res, next) {
    console.log('I am called before static middleware.');
    return next();
});
app.use(express.static( path.join(__dirname, 'public')));
app.use(function(req, res, next) {
    console.log('I am called after static middleware.');
    return next();
});

app.get('/', showClientRequest, function(req, res) {
    res.send('Hi! I am direct message from server :)');
});

function showClientRequest(req, res, next) {
    console.log('You can do something here too...');
    return next();
}

app.listen(5000);
