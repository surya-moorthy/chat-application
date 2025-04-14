import express from "express";
import {createServer} from "node:http";
import cors from "cors";

import dotenv from "dotenv";
import { Server } from "socket.io";
dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const port = process.env.PORT;

const server = createServer(app);

const io = new Server(server,{
  cors : {
    origin : "*",
    methods : ["GET","POST"]
  }
});

io.on("connection",(socket)=>{
  console.log("user is connected with the socket id :",socket.id);
  socket.on("disconnect",()=>{
    console.log(`user ${socket.id} got disconnected`);
  })
})

server.listen(4000,()=>{
  console.log("server is running at server of port 4000");
})
