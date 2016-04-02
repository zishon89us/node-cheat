/**
 * Created by Zeeshan on 4/2/2016.
 */

//------------------------------------------------------
//Find exchange rates i.e. USD to GBP etc...
//Web Link=> https://openexchangerates.org
//------------------------------------------------------

var request = require('request');

var url = 'https://openexchangerates.org/api/latest.json?app_id=1c5fc79208b94e49ae91ca52b2fea1d7';

request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var json = JSON.parse(body);
        console.log(json); //print all list of exchange rates
    } else {
        res.send({message: "Exchange Rate not Found."});
    }
});