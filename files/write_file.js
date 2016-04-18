
//------------------------------------------------------
//fs module to write file in bits or chunks
//Web Link=>
//------------------------------------------------------

var fs = require('fs'),
    fileName = "./sample_files/file_w.txt",
    stream = fs.createWriteStream(fileName);

stream.once('open', function(f) {
    stream.write("This is first row.\n");
    stream.write("This is second row.\n");
    stream.end();
});


//------------------------------------------------------
//fs module to read file as whole
//Web Link=>
//------------------------------------------------------


/*
var sampleText = "Hello World!";

fs.writeFile(fileName, sampleText, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});*/
