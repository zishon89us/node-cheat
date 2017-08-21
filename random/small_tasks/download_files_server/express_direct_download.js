/**
 * Created by Zeeshan on 8/20/2017.
 */

//------------------------------------------------------
//Simple Express Server to download files
//Web Link=>
// nodemon random/small_tasks/download_files_server/express_static_download.js
//------------------------------------------------------

var express = require('express'),
      path = require('path');

app = express();

app.get('/:file_name', function (req, res) {
    res.download(path.join(__dirname, 'public', req.params.file_name), function (err) {
        if (err) {
            console.log("Download Error!");
            console.log(err);
        } else {
            console.log("Download Success :)");
        }
    });
});

app.listen(3000, function(){
    console.log('Listening on 3000');
});