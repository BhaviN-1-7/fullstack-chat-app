import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // If you're using frontend requests
import cookieParser from "cookie-parser";

import path from "path";
import {connectDB} from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import {app,server} from "./lib/socket.js";

dotenv.config();

// const app=express();//deleting for socketio,created this in socket.js

const __dirname=path.resolve();

app.use(cors({origin:"http://localhost:5173",credentials:true}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));//to get the data as req.data,extended true allows nested objects and rich data structures.

app.use("/api/auth",authRoutes);//Any route defined in authRoutes will be prefixed with /api/auth
app.use("/api/messages",messageRoutes);//adding message endpoint

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    })
}

const PORT=process.env.PORT;
//replace app with server for socketio
server.listen(PORT,()=>{
    console.log("server is urnning on port: " +PORT );
    connectDB();
})