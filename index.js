const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
const connect = require('./config/db-config');

const Group = require('./models/group');
const Chat = require('./models/chat');
app.set('view engine', 'ejs');
//app.use('/',express.static(__dirname+'/public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/',(req,res)=>{
    // res.send('<h1> Hello World!! </h1>');
    res.sendFile(__dirname + '/public/index.html')
});



io.on('connection',(socket)=>{
    console.log('a user connected',socket.id);
    socket.on('disconnect',()=>{
        console.log('user disconnected',socket.id);
    });

    // socket.on('from_client',()=>{
    //     console.log("Received event from client");
    // })

    // setInterval(function f(){
    //     socket.emit('from_server');
    // },3000);


    socket.on('join_room',(data)=>{
        console.log("joining a room: ", data.roomid);
        socket.join(data.roomid);

    })

    socket.on('new_msg',async(data)=>{
        //broadcast message to all clients
        //io.emit('msg_rcvd',data);

        //send msg to only the client which is sending the message
        //socket.emit('msg_rcvd',data);

        //apart from the sender send msg to everyone
        //socket.broadcast.emit('msg_rcvd',data);
        console.log("received new message",data);
        const chat = await Chat.create({
            roomid:data.roomid,
            sender:data.sender,
            content:data.message
        })
        io.to(data.roomid).emit('msg_rcvd',data)
    })
});

app.get('/chat/:roomid/:user',async(req,res)=>{
    const group = await Group.findById(req.params.roomid);
    const chats = await Chat.find({
        roomid:req.params.roomid
    });
    console.log(chats);
    res.render('index',{
        roomid: req.params.roomid,
        user:req.params.user,
        groupname:group.name,
        previousmsgs:chats
    });
})

app.get('/group',async(req,res)=>{
    res.render('group');
})

app.post('/group',async(req,res)=>{
    console.log(req.body);
    await Group.create({
        name:req.body.name
    });
    res.redirect('/group')
})

server.listen(3000,async()=>{
    console.log('listening on port 3000');
    connect();
    //console.log("db connected");
});