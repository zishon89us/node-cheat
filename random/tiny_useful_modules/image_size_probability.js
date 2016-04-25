
//------------------------------------------------------
//Get image size without full download.
//Supported image types=> JPG, GIF, PNG, WebP, BMP, TIFF, PSD
//Output=> { width: xx, height: yy, type: 'jpg', mime: 'image/jpeg' }
//Web Link=>
//------------------------------------------------------


var probe = require('probe-image-size');

// Get by URL

probe('https://i.stack.imgur.com/wpzi1.jpg', function (err, result) {
    console.log(result); // => { width: xx, height: yy, type: 'jpg', mime: 'image/jpeg' }
});


//From local

/*
var input = require('fs').createReadStream('./screenshot_dest/github.com!zishon89us!node-cheat-1920x1080.png');

probe(input, function (err, result) {
    console.log(result);
    input.destroy();
});*/
