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




//to store online users
const userSocketMap={};//{userId:socketId}
const userLastOnlineMap = {}; // {userId: timestamp}

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

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

// import { Server } from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173", "https://fullstack-chat-app-gz4z.onrender.com"]
//   },
//   pingInterval: 10000,  // Send ping every 10 seconds
//   pingTimeout: 5000     // Wait 5 seconds for pong before considering disconnected
// });

// // Store online users and their last online times
// const userSocketMap = {};    // { userId: socketId }
// const userLastOnlineMap = {}; // { userId: timestamp }

// export function getReceiverSocketId(userId) {
//   return userSocketMap[userId];
// }

// io.on("connection", (socket) => {
//   console.log("User connected", socket.id);

//   const userId = socket.handshake.query.userId;
  
//   if (!userId) {
//     return socket.disconnect(true); // Disconnect if no userId
//   }

//   // Handle reconnection
//   if (userSocketMap[userId]) {
//     console.log(`User ${userId} reconnected`);
//     // Update the existing socket mapping
//     const oldSocketId = userSocketMap[userId];
//     if (io.sockets.sockets.get(oldSocketId)) {
//       io.sockets.sockets.get(oldSocketId).disconnect(true);
//     }
//   }

//   // Add user to maps
//   userSocketMap[userId] = socket.id;
//   delete userLastOnlineMap[userId]; // Remove from last online if reconnected

//   // Notify all clients about online status
//   io.emit("getOnlineUsers", {
//     onlineUsers: Object.keys(userSocketMap),
//     lastOnlineTimes: userLastOnlineMap
//   });

//   // Handle disconnection
//   socket.on("disconnect", () => {
//     console.log("User disconnected", socket.id, userId);
    
//     // Only update if this was the most recent connection for this user
//     if (userId && userSocketMap[userId] === socket.id) {
//       delete userSocketMap[userId];
//       userLastOnlineMap[userId] = new Date().toISOString();
      
//       io.emit("getOnlineUsers", {
//         onlineUsers: Object.keys(userSocketMap),
//         lastOnlineTimes: userLastOnlineMap
//       });
//     }
//   });

//   // Handle explicit logout
//   socket.on("logout", () => {
//     if (userId) {
//       delete userSocketMap[userId];
//       userLastOnlineMap[userId] = new Date().toISOString();
      
//       io.emit("getOnlineUsers", {
//         onlineUsers: Object.keys(userSocketMap),
//         lastOnlineTimes: userLastOnlineMap
//       });
//     }
//     socket.disconnect(true);
//   });

//   // Heartbeat mechanism
//   socket.on("heartbeat", () => {
//     if (userId) {
//       // Update last active time
//       socket.emit("heartbeat-ack");
//     }
//   });
// });

// export { io, app, server };