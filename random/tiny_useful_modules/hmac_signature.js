/**
 * Created by Zeeshan on 3/7/2016.
 */

var crypto = require('crypto');
var hmac = [];
hmac.secret = 'ODc0YTM3YzUxODFlMWQ1YTdhMGQwY2NiZmE1N2Y1ODdjYzM5NTgyMDJhZjVkYTE4MmQxYzQ5ODk0M2QzNWQxYw==';
hmac.timestamp = 1457326475000;
hmac.path = '/account/';
hmac.message = hmac.path +'\n' + hmac.timestamp;
var sig = crypto.createHmac('sha512', new Buffer(hmac.secret, 'base64'));
hmac.signature = sig.update(hmac.message).digest('base64');

console.log(hmac);