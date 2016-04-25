
//------------------------------------------------------
//Capture Screen-shot of websites
//Web Link=>
//------------------------------------------------------

var Pageres = require('pageres');

var pageres = new Pageres({delay: 2})
    //.src('github.com/zishon89us/node-cheat', ['1280x1024', '480x320', '1024x768', 'iphone 5s'], {crop: true})
    .src('github.com/zishon89us/node-cheat', ['1920x1080']) //creates on capture only
    .dest(__dirname + "/screenshot_dest") //destination folder to store captures
    .run()
    .then(function () {
        console.log('Screen-shots are done!');
    });