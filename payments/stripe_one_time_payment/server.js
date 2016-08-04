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



//charge one time using token
app.post('/charge', function (req, res) {
    if(req.query.token){
        stripe.charges.create({
            amount: req.query.amount,
            currency: req.query.currency || "usd",
            source: req.query.token, // obtained with Stripe.js
            description: req.query.desc,
            metadata: {'node_cheat_by': 'https://github.com/zishon89us'}
        }, function(err, charge) {
            if(err){
                var msg = "stripe.charges.create Failed ";
                console.log(msg, err);
                res.send({message: msg, err: err});
            }else{
                var msg = "stripe.charges.create Succeeded ";
                console.log(msg );
                res.send({message: msg, carge: charge});
            }
        });
    }else{
        res.send({message:"Params Missing"});
    }
});

//get a charge info with ID and also bring customer associated with ti
app.get('/charge', function (req, res) {
    if(req.query.chargeId){
        stripe.charges.retrieve(req.query.chargeId, {
            expand: ["customer"]
        });
    }else{
        res.send({message:"Params Missing"});
    }
});

https.createServer(options, app).listen(3000, function () {
    console.log('Server Started!');
});