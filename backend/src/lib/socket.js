import {Server} from "socket.io";
import http from "http";

import express from "express";

const app=express();

const server=http.createServer(app);

const io=new Server(server,{
    cors:{
        origin:["http://localhost:5173","https://fullstack-chat-app-gz4z.onrender.com"]
    },
});


export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

//to store online users
const userSocketMap={};//{userId:socketId}
const userLastOnlineMap = {}; // {userId: timestamp}

io.on("connection",(socket)=>{
    console.log("a user connected",socket.id);

    const userId=socket.handshake.query.userId;
    if(userId) {
        userSocketMap[userId]=socket.id;
        userLastOnlineMap[userId] = null;
    }

    io.emit("getOnlineUsers",{
        onlineUsers:Object.keys(userSocketMap),
    lastOnlineTimes:userLastOnlineMap});//to send events to all the connected clients

    socket.on("disconnect",()=>{
        console.log("a user disconnected",socket.id);
        
        if(userId){
            delete userSocketMap[userId];
    // Set last online time when user disconnects
      userLastOnlineMap[userId] = new Date().toISOString();
        }

        io.emit("getOnlineUsers",{
      onlineUsers: Object.keys(userSocketMap),
      lastOnlineTimes: userLastOnlineMap
    });//to send events to all the connected clients

    });
});

export {io,app,server};