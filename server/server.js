const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message')

var port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, './../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log("New User Connected");

    // socket.emit from admin text Welcome to chat app
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App'));

    // socket.broadcast.emit from text New user joined
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'));

    socket.on('createMessage', (message, callback) => {
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from server');
    });

    socket.on('createPositionMessage', (coords)=>{
       io.emit('newLocationMessage',generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        console.log('User was Disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server Start on Port: ${port}`);
});