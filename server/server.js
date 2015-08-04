// Load ExpressJS, HTTP, SocketIO, and MomentJS libraries.
var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    moment = require('moment'),
    cors = require('express-cors');

// Allow CORS from any origin.
app.use(cors());

// Declare messages collection, and launch port.
var messages = [],
    port = 3000,
    dateFormat = 'hh:mm';

// Handle the client connecting to the socket.
io.on('connection', function(socket) {

    var
    // Provide a name to the newly connected client, based on the socket connection id.
        client = 'G_' + socket.conn.id.substring(0, 4),
    // Set the current date, user-friendly formatted.
        date = moment().format(dateFormat),
    // New connection message to be broadcasted to clients.
        messageData = {
            client: client,
            date: date,
            message: 'Hey there, I just joined the chat!'
        };

    console.log(client + ' connected.');

    messages.push(messageData);

    // Broadcast the current messages to the newly connected client.
    socket.emit('currentMessages', messages);
    // Broadcast to all client listeners (except the newly connected client) about the new joined client.
    socket.broadcast.emit('newMessage', messageData);

    // Receive new messages from client.
    socket.on('newMessage', function(message) {

        console.log(client + ' said ', message);

        var date = moment().format(dateFormat),
            messageData = {
                client: client,
                date: date,
                message: message
            };

        messages.push(messageData);
        // Announce the new message to all participants (including the current client).
        io.sockets.emit('newMessage', messageData);

    });

    // Handle a disconnected client.
    socket.on('disconnect', function() {

        var date = moment().format(dateFormat);
        var messageData = {
            client: client,
            date: date,
            message: 'Bye-bye!'
        };

        messages.push(messageData);
        io.sockets.emit('newMessage', messageData);

        console.log(client + ' disconnected.');

    });

});

// Start the HTTP server.
http.listen(port, function() {
    console.log('Listening on *:' + port);
});
