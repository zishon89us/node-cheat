/**
 * Created by zeeshan on 2/22/2017.
 */

//------------------------------------------------------
//get local ip address in nodejs OR ip address where app is running
//Web Link=> https://github.com/indutny/node-ip
//http://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
//http://stackoverflow.com/questions/10750303/how-can-i-get-the-local-ip-address-in-node-js
// Run : node my-ip.js
//------------------------------------------------------


var ip = require('ip');

console.log(ip.address()) // my ip address
