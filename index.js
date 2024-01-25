const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

// app.get('/',(req,res)=>{
//     // res.send('<h1> Hello World!! </h1>');
//     res.sendFile(__dirname + '/public/index.html')
// });

app.use('/',express.static(__dirname+'/public'));

io.on('connection',(socket)=>{
    console.log('a user connected',socket.id);
    socket.on('disconnect',()=>{
        console.log('user disconnected',socket.id);
    });

    socket.on('from_client',()=>{
        console.log("Received event from client");
    })

    setInterval(function f(){
        socket.emit('from_server');
    },3000);
});

server.listen(3000,()=>{
    console.log('listening on port 3000');
});