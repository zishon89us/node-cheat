// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: 'XXXXXXXXXXX', // your App ID
		'clientSecret' 	: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // your App Secret
		'callbackURL' 	: 'http://localhost:3000/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'XXXXXXXXXXX',
		'consumerSecret' 	: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
		'callbackURL' 		: 'http://localhost:3000/auth/twitter/callback'
	}

};