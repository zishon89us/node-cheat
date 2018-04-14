/**
 * Created by Zeeshan on April 14, 2018.
 */

//------------------------------------------------------
//send sms usign twilio service
//Web Link=>
//Run : node twillio.js
//------------------------------------------------------

const _ = require('lodash');
const twilio = {
	'from': '+1XXXXXXXXXXX',
	'accountSid': 'AC5a615xxxxxxxxxxxxxxxxxxxx', // process.env.accountSid
	'authToken': 'dd4cdxxxxxxxxxxxxxxxxxxxd33c390a81' // process.env.authToken
};

const client = require('twilio')(twilio.accountSid, twilio.authToken);
const toAll = ['+1XXXXXXXXX', '+‭921XXXXXXXXX'];
const message = 'Hello via Node-Cheat!';

_.forEach(toAll, (to)=> {
	client.messages.create({
		to: to,
		from: twilio.from,
		body: message
	}, (err, message) => {
		if (err) {
			console.log(err)
		} else {
			console.log(`sms sent to ${message.to}`);
		}
	});
});