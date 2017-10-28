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


/*Option 1*/
const ip = require('ip');

console.log(ip.address()) // my ip address




/*Option 2*/

const os = require('os'),
	interfaces = os.networkInterfaces();

let addresses = [];
for (let k in interfaces) {
	for (let k2 in interfaces[k]) {
		let address = interfaces[k][k2];
		if (address.family === 'IPv4' && !address.internal) {
			addresses.push(address.address);
		}
	}
}
//console.log(interfaces);
console.log(addresses);
