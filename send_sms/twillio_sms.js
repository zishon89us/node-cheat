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
	'from': process.env.TWILIO_PHONE_NUMBER || '+1XXXXXXXXXXX',
	'accountSid': process.env.TWILIO_ACCOUNT_SID || 'YOUR_TWILIO_ACCOUNT_SID',
	'authToken': process.env.TWILIO_AUTH_TOKEN || 'YOUR_TWILIO_AUTH_TOKEN'
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