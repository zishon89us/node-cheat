// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '1017328211677854', // your App ID
		'clientSecret' 	: 'e90bf7d8951bd8da8278af447a82fb92', // your App Secret
		'callbackURL' 	: 'http://localhost:3000/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: '5IMFH1EMpVGSIxly6IUeA',
		'consumerSecret' 	: 'FOBLpDt8fWrvDJoJCH63cS5uRDh962wCg9Ajh1gEI',
		'callbackURL' 		: 'http://localhost:3000/auth/twitter/callback'
	}

};