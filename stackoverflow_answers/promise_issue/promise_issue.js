/**
 * Created by zeeshan on 3/2/2018.
 */


var express = require('express');
var fs = require('fs');
var app = express();

app.post('/readList', function(req, res) {
	//Assuming sample data coming in req.body
	//Remove this when you run at you side
	req.body = {
		path: 'temp_dir'
	};

	var cleared = false;
	var listedFiles = [];
	//Promising readList :)
	function readList(){
		return new Promise(function (resolve, reject) {
			// Suppose req.body.path is 'temp_dir' and it has 2 files
			fs.readdir(req.body.path, (err, files) => {
				console.log(files);
			/*files.forEach(file = > {
			 console.log(file);
			 var fileDetail = {
			 name: '',
			 local: true,
			 filetype: 'fas fa-folder-open',
			 filepath: '',
			 isFile: false
			 }
			 if (!cleared) {
			 listedFiles = [];
			 cleared = true;
			 }
			 // really? you can think of it later!!
			 fileDetail.name = file;
			 fileDetail.filepath = req.body.path + file

			 // I changed below to avoid surprises for you in data!
			 const stats = fs.statSync(req.body.path + file);
			 fileDetail.isFile = stats.isFile();
			 if (stats.isFile())
			 fileDetail.filetype = 'far fa-file-alt';
			 else
			 fileDetail.filetype = 'fas fa-folder-open'
			 listedFiles.push(fileDetail);
			 });*/
			resolve(listedFiles);
		});
		});
	}

	readList().then((data) => {
		console.log('vorta');
		res.send(JSON.stringify(data));
	});
})


app.listen(process.env.PORT || 3000);
console.log('Listening on port 3000');