var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    port = process.env.PORT || 3000;

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

var users = {},
    sockets = {};

io.on('connection', function (socket) {
    var addedUser = false;

    //only private messaging is handled
    socket.on('new message', function (to, data) {

        // send private message by looking at socket info previously saved
        sockets[users[to]].emit(
            'message',
            {
                message : data,
                from : sockets[socket.id].username
            }
        );

    });

    //handle new user
    socket.on('add user', function (username) {

        users[username] = socket.id;    //  reference to your socket ID
        sockets[socket.id] = { username : username, socket : socket };  //  reference to your socket

        // let everyone know
        socket.broadcast.emit('user joined', {
            username: socket.username,
            onlineUsers: Object.keys(sockets).length
        });

    });

});
