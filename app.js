const express = require("express");
const http = require('http');
const socketIo = require("socket.io");

const index = require("./routes/index");
const port = process.env.PORT || 8081;

var app = express();

app.use('/', index);

const server = http.createServer(app);

const io = socketIo(server);

io.on("connection", (socket) => {
    console.log("Client connected.");
})

server.listen(port, () => console.log(`Express App running on port ${port}`));