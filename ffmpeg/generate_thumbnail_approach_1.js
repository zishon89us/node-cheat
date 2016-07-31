/**
 * Created by Hair on 7/31/2016.
 */

var ffmpeg = require('fluent-ffmpeg'),
    fs = require('fs');

ffmpeg()
    .input('./files/videos/sample_1.mp4')
    .size('1280x?')
    .seek(3)
    .frames(1)
    .autopad()
    .output('./thumbs/' + Date.now() + '.jpg')
    .on('end', function(){
        console.log('thumb saved');
    })
    .on('error', function(err){
        console.log('thumb not saved ', err);
    })
    .run()