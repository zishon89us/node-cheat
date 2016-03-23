//------------------------------------------------------
//Read README.md
//Web Link=>
//------------------------------------------------------


var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;

app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	app.set('view engine', 'ejs'); // set up ejs for templating

});

// routes ======================================================================

var home = require('./controllers/home');
app.get('/', function (req, res) {
	res.render('index.ejs', {title: home.title});
});

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
