// import express from "express";
// import socket from "socket.io";
// import {createServer} from "node:http";
// import cors from "cors";
// const app = express();
// app.use(cors({origin : "http://localhost:5173"}));
// app.use(express.json());

// const server = createServer(app);
// const io = new socket.Server(server,{
//     cors: {
//         origin : "http://localhost:5173",
//         methods: ['GET', 'POST'],
//         credentials: true
//     }
// });

// io.on("connection",function (socket){
//    console.log("user connected");
//    socket.emit("message","hello from server");

//    socket.on("ClientMessage",(msg)=>{
//     console.log(`client provide the msg : ${msg}`);
//     socket.broadcast.emit(`Message you have sent : ${msg}`);
//    })
//    socket.on("disconnect",()=>{
//     console.log("user disconnected")
//    })
// })

// server.listen(3000,()=>{
//     console.log("app is running at port")
// })