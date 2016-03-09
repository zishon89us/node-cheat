/**
 * Created by abdulmoiz on 3/10/2016.
 */
//----------------------------------------------------
// BASIC ROUTES IMPLEMENTATION CHEATS GET POST UPDATE DELETE etc
//----------------------------------------------------
//express router
var express = require('express');
var router = express.Router();
//GET method
router.get('/resource', function(req, res){
    //Target functionality :: Get resource and respond

    //call controller method for getting resource and respond

    //responding code eg
    res.send('resource fetched')


});

//GET method with query param say /resource?type='light'
router.get('/resource', function(req, res){
    //Target functionality :: Get resource w.r.t type and respond
    var type = req.query.type;
    //call controller method for getting resource by type and respond
    //responding code eg
    res.send('resource of'+ type +' fetched');
});

//GET method with params say /resource/:id
router.get('/resource/:id', function(req, res){
    //Target functionality :: Get resource by id and respond
    var resourceId = req.params.id;
    //call controller method for getting resource by id and respond
    //responding code eg
    res.send('resource of id '+ resourceId +' fetched');
});

//POST method {name, type}
router.post('/resource', function(req, res){
    //Target functionality :: Create a resoruce by name and type and send confirmation
    //get form data via req.body
    var resourceData = {
        name : req.body.name,
        type : req.body.type
    };
    //call controller method for creating a resource and respond

    //responding code eg
    res.send('resource created')


});

//PUT method {name}
router.put('/resource/:id', function(req, res){
    //Target functionality :: Update a resoruce name and/or type and send confirmation
    //get form data via req.body
    var updateData ={
        name : req.body.date,
        type : req.body.type
    };
    var resourceId = req.params.id;
    //call controller method for updating a resource w.r.t id and respond

    //responding code eg
    res.send('resource updated')

});

//DELETE delete a resource by id
router.delete('/resource/:id', function(req, res){
    //Target functionality :: Delete a resoruce name and/or type and send confirmation
    //get form data via req.body
    var resourceId = req.params.id;
    //call controller method for deleting a resource w.r.t id and respond

    //responding code eg
    res.send('resource deleted');

});


//DELETE delete a resource by id adding security pass phrase
router.delete('/resource/:id', verifyPassPhrase, function(req, res){
    //Target functionality :: Delete a resoruce by verifying passphrase
    //get form data via req.body
    var resourceId = req.params.id;
    //call controller method for deleting a resource w.r.t id and respond

    //responding code eg
    res.send('resource deleted');

});

//helpers

function verifyPassPhrase(req, res, next){
    /*lets say password is expressIsCool!
    and we are getting it in authorization header*/
    var pass = 'expressIsCool!'
    if(req.headers.authorization === pass){
        next();
    }
    else{
       res.send('Bad passhphrase!');
    }
}