//------------------------------------------------------
//fs module to read file in sync and async way
//Web Link=>
//------------------------------------------------------


var fs = require('fs'),
    filePath = './sample_files/sample_css.css';

// this for async way
/*fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) throw err;
    console.log(data);
});*/

//this is sync way
var css = fs.readFileSync(filePath, 'utf8');
console.log(css);