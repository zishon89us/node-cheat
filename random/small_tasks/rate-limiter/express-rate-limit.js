/**
 * Created by Zeeshan on 8/23/2017.
 */

//------------------------------------------------------
//Basic rate-limiting middleware for express
//Web Link=> https://github.com/nfriedly/express-rate-limit
//------------------------------------------------------

const app = (require('express'))();

// viewed at http://localhost:5000
app.get('/', function(req, res) {
    res.send('Hello World!');
});


app.listen(5000);
