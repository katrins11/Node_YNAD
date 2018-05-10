var io = require('socket.io')(5000);

jChat = {};

jChat.getChat = function() {
    //doo stuff with req and send with res
    io.on('connection', function(socket){
        socket.on('chat message', function(jData){
            // VISIBLE IN TERMINAL
            // console.log("Put in chat: " + jData); 
            // SENDS TO EVERYONE
            io.emit('chat message', jData);
        });
    });
}

module.exports = jChat;