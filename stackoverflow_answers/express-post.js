const express = require('express');
const router = express.Router();

// curl -X POST http://localhost:3000/bar/hello
router.post("/hello",(req, res) => {
	res.send('It is POST');
});

// curl -X GET http://localhost:3000/bar/hi
router.get('/hi', function(req, res, next) {
	res.send('It is GET');
});

module.exports = router;