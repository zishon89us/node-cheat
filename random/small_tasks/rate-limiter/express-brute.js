/**
 * Created by Zeeshan on 8/23/2017.
 */

//------------------------------------------------------
//Simple Express Server rate limiting example
//Web Link=> https://github.com/AdamPflug/express-brute
//------------------------------------------------------

const app = (require('express'))();

// viewed at http://localhost:5000
app.get('/', function(req, res) {
    res.send('Hello World!');
});


app.listen(5000);
