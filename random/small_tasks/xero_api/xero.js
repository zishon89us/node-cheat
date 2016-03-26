/**
 * Created by Zeeshan on 3/23/2016.
 */

var Xero = require('xero'),
    fs = require('fs');

var CONSUMER_KEY = 'FBT61LJM44WD24KVTABGEA7ZVFHPGZ',
    CONSUMER_SECRET = 'GPK3YW08ZXXSX7OCDGRN1HLCVTWUNO',
    RSA_PRIVATE_KEY = fs.readFileSync('./keys/privatekey.pem');

var xero = new Xero(CONSUMER_KEY, CONSUMER_SECRET, RSA_PRIVATE_KEY);
xero.call('GET', '/Payruns', null, function(err, json) {
    if (err) {
        console.log(err);
        //return res.json(400, {error: 'Unable to contact Xero'});
    }
    console.log(200, json);

    //return res.json(200, json);
});
