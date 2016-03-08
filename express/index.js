//------------------------------------------------------
//Option 1 :run bat file in node.js
//Web Link=>
//------------------------------------------------------

var automaton = require('automaton').create( );
automaton.run('run', {cmd: 'my.bat'}).pipe(process.stdout);


//------------------------------------------------------
//Option 2 :run bat file in node.js
//Web Link=>
//------------------------------------------------------

/*
var spawn = require('child_process').spawn;
var bat = spawn('cmd.exe', ['/c', 'my.bat']);

bat.stdout.on('data', function(data) {
    console.log(data);
});

bat.stderr.on('data', function(data) {
    console.log(data);
});

bat.on('exit', function(code)  {
    console.log("Child exited with code ${code}");
});*/


//------------------------------------------------------
//Option 3 :run bat file in node.js
//Web Link=>
//------------------------------------------------------
/*
var shell = require('shelljs');
shell.exec('my.bat');*/
