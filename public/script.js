console.log('welcome to sockets');
var socket=io();

let btn = document.getElementById("btn");
btn.addEventListener("click",()=>{
    socket.emit("from_client");
})
socket.on('from_server',()=>{
    let div = document.getElementById("from_server");
    let p = document.createElement("p");
    p.textContent = "Received an event from the server";
    div.appendChild(p);
})