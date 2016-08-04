/**
 * Created by Zeeshan on 8/3/2016.
 */

//------------------------------------------------------
//https basic node.js server
//Web Link=>
//Run : node server.js
//Note :
//------------------------------------------------------


var https = require('https'),
    fs = require('fs'),
    config = require('../config'),
    stripe = require('stripe')(config.STRIPE_KEY),
    app = require('express')();

var options = {
    key: fs.readFileSync('../../HTTPS/keys/key.pem'),
    cert: fs.readFileSync('../../HTTPS/keys/cert.pem')
};

app.get('/', function (req, res) {
    res.send('Hello World!');
});

//create stripe customer
app.post('/customer', function (req, res) {
    stripe.customers.create(
        { email: req.body.email },
        function(err, customer) {
            if(err){
                console.log("stripe.customers.create Failed ", err);
                res.send({message: "stripe.customers.create Failed ", err: err});
            }else{
                console.log("stripe.customers.create Succeeded ");
                res.send({message: "stripe.customers.create Succeeded ", customer: customer});
            }
        }
    );
});


https.createServer(options, app).listen(3000, function () {
    console.log('Server Started!');
});