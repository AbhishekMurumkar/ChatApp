var express=require("express");
var app=express();
var server=require("http").createServer(app);
var io=require("socket.io").listen(server);
var users=[];
var connections=[];  

server.listen(process.env.PORT||4000);
app.get('/',function(req,res){
    res.sendFile(__dirname+"/index_1.html");
});

io.sockets.on("connection",function(socket){
    connections.push(socket);
    console.log("connected %s sockets connected",connections.length);
    
    socket.on("disconnect",function(){
        //disconnected
        users.splice(users.indexOf(socket.username),1);
        updateUserNames();
        connections.slice(connections.indexOf(socket),1);
        console.log("disconnected: %s connected",connections.length);
    });

    //send message
    socket.on("sendMessage",function(toAddress,data){
        console.log("data=");
        console.log(data);
        io.sockets.emit("newMessage",{msg:data,from:socket.username,to:toAddress });
    });

    //creating new user
    socket.on("newUser",function(data,callback){
        callback(true);
        socket.username=data;
        users.push(socket.username);
        updateUserNames();
    });

    function updateUserNames(){
        io.sockets.emit("getUsers",users);
    }
});