
var express = require('express');
var http = require('http');
var path = require('path');
var sio = require('socket.io');

var app = express();
var users = [];
var user_id = new Object();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', function(req, res){
    res.render('index', { title: 'Express' });
});

/*http.createServer(app).listen(app.get('port'), function(){
 console.log('Express server listening on port ' + app.get('port'));
 });*/
var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});


////////////////////////////////

var io = sio.listen(server);
io.sockets.on('connection',function(socket){
    var my_count=users.length+1;;
    ///////////////////
    socket.emit('getusers',users)
    //////////////////
    socket.on('join',function(name){
        socket.nickname = name;
        user_id[name] = socket.id;
        var arg = [];
        arg[0]=name+' joined the chat';
        users.push(name);
        socket.emit('announcement',arg[0]);
        socket.broadcast.emit('announcement',arg[0]);
        socket.emit('users',users);
        socket.broadcast.emit('users',users);
        socket.emit('online',name);
        socket.broadcast.emit('online',name);
    });


    socket.on('text',function(msg){
        socket.broadcast.emit('text',socket.nickname,msg);
    });

    socket.on('disconnect',function(){

        socket.broadcast.emit('discon',socket.nickname);
        console.log('!!!!!!!!!!!!!!!!!Socket is disconnected name   '+socket.nickname);
        var count;
        for(var i=0;i<users.length;i++){
            if(users[i] == socket.nickname)
                count = i;

        }
        users.splice(count,1);
        socket.emit('users',users);
        socket.broadcast.emit('users',users);
        socket.broadcast.emit('offline',socket.nickname);
    });

    socket.on('pvt_',function(arr){
        io.sockets.socket(user_id[arr[0]]).emit('text',socket.nickname,arr[1]);
    });

});
