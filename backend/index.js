const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');


const globalSocket = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})

globalSocket.on('connection', (userSocket) => {
    console.log('New user connected',userSocket.id);
    userSocket.emit('userConnected', { message: 'Welcome to the chat' })
    // userSocket.on('message', (data) => {
    //     console.log(data);
    //     userSocket.broadcast.emit('recivedmessage', data)
    // })

    userSocket.on('sendmessage',(data)=>{
        console.log(data,data.room,data.message);
        userSocket.join(data.room);
        userSocket.broadcast.to(data.room).emit('roommessage', data.message)
    })

    userSocket.on('leaveRoom',(room)=>{
        userSocket.leave(room);
        globalSocket.to(room).emit('userLeft',{message:`User with id ${userSocket.id} left the room`})
    })
})


server.listen(4000, () => {
    console.log('Server is running on port 4000');
})