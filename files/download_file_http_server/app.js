var http = require('http');

http.createServer(function (req, res) {

    var fileContent = "Hey! I just got downloaded from server";

    res.writeHead(200, {
        'Content-Type': 'application/force-download',
        'Content-disposition': 'attachment; filename=sample_file_name.txt'
    });

    res.end(fileContent);

}).listen(3000, '127.0.0.1');

console.log('Server running at http://127.0.0.1:3000/');