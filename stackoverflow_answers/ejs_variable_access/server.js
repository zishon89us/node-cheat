//------------------------------------------------------
//Read README.md
//Web Link=>
//------------------------------------------------------


const express  = require('express');
const app = express()
const port     = process.env.PORT || 3000;

// routes ======================================================================

const home = require('./controllers/home');
app.get('/', function (req, res) {
	res.render('index.ejs', {title: home.title});
});

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
