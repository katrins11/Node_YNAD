var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(5000);
var fs = require('fs');
app.use(express.static(__dirname + '/images'));

app.get('/chat', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.on('chat message', function(jData){
        // VISIBLE IN TERMINAL
        console.log("Put in chat: " + jData); 
        // SENDS TO EVERYONE
        io.emit('chat message', jData);
    });
});