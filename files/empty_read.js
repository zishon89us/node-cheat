/**
 * Created by Zeeshan on 3/10/2016.
 */

/*var fs = require('fs');
var stream = fs.createReadStream('sample_files/file4.txt');
stream.on('readable', function () {
    console.log("readable event called");
} );*/

var fs = require('fs');
var stream = fs.createReadStream('https://drive.google.com/file/d/0B6OhDbvojTLKMm1OeWNibXdBVnM/view?usp=sharing');
stream.on('readable', function () {
    console.log("readable event called");
} );