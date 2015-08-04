// Load ExpressJS, HTTP, SocketIO, and MomentJS libraries.
var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    moment = require('moment');

// Declare messages collection, and launch port.
var messages = [],
    port = 3000;

// Handle the client connecting to the socket.
io.on('connection', function(socket) {

    var member = 'Guest' + socket.conn.id.substring(0, 4),
        date = moment().format('hh:mm:ss'),
        messageData = {
            member: member,
            date: date,
            message: 'Hey there, I just joined the chat!'
        };

    console.log(member + ' connected.');

    messages.push(messageData);

    socket.emit('currentMessages', messages);
    socket.broadcast.emit('newMessage', messageData);

    socket.on('newMessage', function(message) {

        console.log(member + ' said ', message);

        var date = moment().format('hh:mm:ss');
        var messageData = {
            member: member,
            date: date,
            message: message
        };

        messages.push(messageData);
        io.sockets.emit('newMessage', messageData);

    });

    socket.on('disconnect', function() {

        var date = moment().format('hh:mm:ss');
        var messageData = {
            member: member,
            date: date,
            message: 'Bye-bye!'
        };

        messages.push(messageData);
        io.sockets.emit('newMessage', messageData);

        console.log(member + ' disconnected.');

    });

});

http.listen(port, function() {
    console.log('Listening on *:' + port);
});
