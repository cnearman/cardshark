const express = require("express");
const http = require('http');
const socketIo = require("socket.io");

const index = require("./routes/index");
const port = process.env.PORT || 8082;

var app = express();

app.use('/', index);

const server = http.createServer(app);

const io = socketIo(server);

var sockets = {};
var sessions = {};

io.on("connection", (socket) => {
    sockets[socket.id] = socket;

    socket.on('new_session', () => {
        console.log('new session');
        if(socket.session){
            return;
        }

        var sessionId = makeid(10);
        socket.session = sessionId;
        console.log(`session ID : ${sessionId}`)
        sessions[sessionId] = {
            players : [{name: 'player_1'}]
        }
        socket.emit('join_session', {'session_id': sessionId});
    });

    socket.on('join_channel', (config) => {
        console.log(`Received. Join Channel`);
        var channel = config.channel;

        if (channel in socket.channels){
            // already joined
            return;
        }

        if (!(channel in channels)){
            channels[channel] = {};
        }
        
        // TODO: Setup Metadata for user.

        for (id in channels[channel]){
            console.log(`Sending begin_peer_connection - ${id} to ${socket.id} `);
            channels[channel][id].emit('begin_peer_connection', {'peer_socket_id': socket.id, 'should_create_offer' : false});
            socket.emit('begin_peer_connection', {'peer_socket_id':id, 'should_create_offer' : true});
        }

        channels[channel][socket.id] = socket;
        socket.channels[channel] = channel;
    });

    socket.on('disconnect', function () {
        console.log(`Client disconnected. Socket Id: ${socket.id}`);
        for (var channel in socket.channels) {

            delete socket.channels[channel];
            delete channels[channel][socket.id];

            for (id in channels[channel]){
                console.log(`Emitting removePeer message to ${id}`);
                channels[channel][id].emit('removePeer', { 'peer_id' : socket.id});
                socket.emit('removePeer', {'peer_id': id});
            }
        }

        delete sockets[socket.id];
    });

    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
       return result;
    }
})

server.listen(port, () => console.log(`Express App running on port ${port}`));