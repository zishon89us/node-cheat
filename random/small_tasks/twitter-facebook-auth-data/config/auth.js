// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: 'xxxxxxxxxxxxx', // your App ID
		'clientSecret' 	: 'xxxxxxxxxxxxxxxxxxxxxxxxx', // your App Secret
		'callbackURL' 	: 'http://localhost:3000/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'xxxxxxxxxxxxxxxxxx',
		'consumerSecret' 	: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
		'callbackURL' 		: 'http://localhost:3000/auth/twitter/callback'
	}

};