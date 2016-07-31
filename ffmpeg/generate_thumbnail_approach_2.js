/**
 * Created by Hair on 7/31/2016.
 */

var ffmpeg = require('fluent-ffmpeg'),
    fs = require('fs');

var proc = ffmpeg('./files/videos/sample_1.mp4')
    // setup event handlers
    .on('filenames', function(filenames) {
        console.log('screenshots are ' + filenames.join(', '));
    })
    .on('end', function() {
        console.log('screenshots were saved');
    })
    .on('error', function(err) {
        console.log('an error happened: ' + err.message);
    })
    // take 2 screenshots at predefined timemarks and size
    .takeScreenshots({ count: 2, timemarks: [ '00:00:02.000', '6' ], size: '1280x?' }, './thumbs');
