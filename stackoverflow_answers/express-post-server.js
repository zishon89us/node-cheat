const express = require('express');
const bar = require('./express-post');
const app = express();

// curl -X GET http://localhost:3000/foo
app.get('/foo', function (req, res, next) {
	res.send('This is foo GET!');
});

// register
app.use('/bar', bar);

app.listen(3000);
