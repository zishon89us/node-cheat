/**
 * Created by Zeeshan on 3/23/2016.
 */

//------------------------------------------------------
//xero api
//Web Link=>
//------------------------------------------------------

var Xero = require('xero-api'),
    fs = require('fs'),
    q = require('q');

var CONSUMER_KEY = 'FBTxxxxxxxxxxxxxxxxxxxxxxx',
    CONSUMER_SECRET = 'GPK3xxxxxxxxxxxxx',
    RSA_PRIVATE_KEY = fs.readFileSync('./keys/privatekey.pem');

var xero = new Xero(CONSUMER_KEY, CONSUMER_SECRET, RSA_PRIVATE_KEY);

function promisified(x) {

    var deferred = q.defer();

    if (typeof x != "string") {
        deferred.reject('Payrun Identifier must be string.');
    } else {
        xero.payroll('GET', '/Payruns', null, function (err, json) {
            if (err) {
                deferred.reject(err);
            }
            deferred.resolve(json);
        });
    }

    return deferred.promise;
}

promisified("").then(function (data) {
    console.log("data ", data);
}).fail(function (err) {
    console.log("err ", err);
});
