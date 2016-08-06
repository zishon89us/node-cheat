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
    ejs = require('ejs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    app = require('express')();

app.use(bodyParser.json({ type: 'application/*+json' }))

app.set('view engine', 'ejs');


var options = {
    key: fs.readFileSync('../../HTTPS/keys/key.pem'),
    cert: fs.readFileSync('../../HTTPS/keys/cert.pem')
};

app.get('/', function (req, res) {
    res.render('create_customer', { });
});

app.get('/page2', function (req, res) {
    res.render('card_token', { });
});


//get customer with customer_id
app.get('/customer', function (req, res) {
    if(req.query.customer_id){
        stripe.customers.retrieve(req.query.customer_id,
            function(err, customer) {
                if(err){
                    var msg = "stripe.customers.retrieve Failed ";
                    console.log(msg, err);
                    res.send({message: msg, err: err});
                }else{
                    var msg = "stripe.customers.retrieve Succeeded ";
                    console.log(msg );
                    res.send({message: msg, customer: customer});
                }
            }
        );
    }else{
        res.send({message:"Params Missing"});
    }
});

//create stripe customer
app.post('/customer', function (req, res) {
    console.log("creating customer with source in query ", req.query.source);
    stripe.customers.create({
            email: req.query.email || Date.now()+"@nodecheat.com",
            description: req.query.description || "Desc. for " + Date.now()+"@nodecheat.com" ,
            source: req.query.source // obtained with Stripe.js
        }, function(err, customer) {
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

//add another source to customer (add another credit card to customer)
app.post('/add-card', function (req, res) {
    if(req.query.source && req.query.customer_id){
        stripe.customers.createSource(req.query.customer_id, {
                source: req.query.source // obtained with Stripe.js
            }, function(err, card) {
                if(err){
                    var msg = "stripe.customers.createSource Failed ";
                    console.log(msg, err);
                    res.send({message: msg, err: err});
                }else{
                    var msg = "stripe.customers.createSource Succeeded ";
                    res.send({message: msg, card: card});
                }
            }
        );
    }else{
        res.send({message:"Params Missing"});
    }
});

//delete card form customer
app.post('/delete-card', function (req, res) {
    if(req.query.card_id && req.query.customer_id){
        stripe.customers.deleteCard(
            req.query.customer_id,
            req.query.card_id,
            function(err, confirmation) {
                if(err){
                    var msg = "stripe.customers.deleteCard Failed ";
                    console.log(msg, err);
                    res.send({message: msg, err: err});
                }else{
                    var msg = "stripe.customers.deleteCard Succeeded ";
                    res.send({message: msg, confirm: confirmation});
                }
            }
        );
    }else{
        res.send({message:"Params Missing"});
    }
});


//charge one time using customer_id
app.post('/charge-immediate', function (req, res) {
    if(req.query.customer_id){
        stripe.charges.create({
            amount: req.query.amount,
            currency: req.query.currency || "usd",
            customer: req.query.customer_id, // obtained with Stripe.js
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
                res.send({message: msg, charge: charge});
            }
        });
    }else{
        res.send({message:"Params Missing"});
    }
});

//charge customer but don't capture
app.post('/charge-hold', function (req, res) {
    if(req.query.customer_id){
        stripe.charges.create({
            amount: req.query.amount,
            currency: req.query.currency || "usd",
            customer: req.query.customer_id, // obtained with Stripe.js
            description: req.query.desc,
            capture: false,
            statement_descriptor : "Node Cheat",
            metadata: {'node_cheat_by': 'https://github.com/zishon89us'}
        }, function(err, charge) {
            if(err){
                var msg = "stripe.charges.create Failed ";
                console.log(msg, err);
                res.send({message: msg, err: err});
            }else{
                var msg = "stripe.charges.create Succeeded ";
                console.log(msg );
                res.send({message: msg, charge: charge});
            }
        });
    }else{
        res.send({message:"Params Missing"});
    }
});

//charge one time using token
app.post('/charge-capture', function (req, res) {
    if(req.query.charge_id){
        stripe.charges.capture(req.query.charge_id, function(err, charge) {
            if(err){
                var msg = "stripe.charges.capture Failed ";
                console.log(msg, err);
                res.send({message: msg, err: err});
            }else{
                var msg = "stripe.charges.capture Succeeded ";
                console.log(msg );
                res.send({message: msg, charge: charge});
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


//Events

//get a charge info with ID and also bring customer associated with ti
app.get('/event', function (req, res) {
    if(req.query.event_id){
        stripe.events.retrieve(req.query.event_id,
            function(err, event) {
                if(err){
                    var msg = "stripe.events.retrieve Failed ";
                    console.log(msg, err);
                    res.send({message: msg, err: err});
                }else{
                    var msg = "stripe.events.retrieve Succeeded ";
                    console.log(msg );
                    res.send({message: msg, event: event});
                }
            }
        );
    }else{
        res.send({message:"Params Missing"});
    }
});



https.createServer(options, app).listen(3000, function () {
    console.log('Server Started!');
});