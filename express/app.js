/**
 * Created by Zeeshan on 3/7/2016.
 */

//------------------------------------------------------
//API methods in node.js using express
//Web Link=> http://stackoverflow.com/questions/35813290/how-to-write-api-methods-nodejs-express-3-application-in-visual-studio-2015/35813955#35813955
//------------------------------------------------------

var express = require('express')
var app = express()

//automated args received here
console.log(process.argv[2]);
console.log(process.argv[3]);
console.log(process.argv[4]);

var routes = require('./routes');

//you can check if server is not down
app.get('/live', function (req, res) {
    res.send('Yes I am breathing!');
})

//like comment api
//IT SHOULD BE 'POST' BUT FOR TESTING PURPOSE I HAVE KEPT I 'GET' TEMPORARILY
app.get('/comment/like', function(req, res, next) { //http://localhost:3000/comment/like
    console.log('Step 1 @ app.js');
    routes.likeComment(req, res);
});

//unlike comment api
app.post('/comment/unlike', function(req, res, next) {
    routes.unlikeComment(req, res);
});

app.listen(3000);
console.log('Listening');