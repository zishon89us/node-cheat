/**
 * Created by Zeeshan on 3/19/2016.
 */

//------------------------------------------------------
//pdf file in browser
//Web Link=> http://stackoverflow.com/questions/36097762/how-do-i-find-path-to-item-in-nodejs/36098977#36098977
//------------------------------------------------------

var express = require('express'),
    fs = require('fs'),
    app = express();

app.get('/', function (req, res) {
    var filePath = "/files/my_pdf_file.pdf";

    fs.readFile(__dirname + filePath , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
    });
});

app.listen(3000, function(){
    console.log('Listening on 3000');
});
