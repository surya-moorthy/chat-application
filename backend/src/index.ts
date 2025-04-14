import express from "express";
import { WebSocket } from "ws";

const app = express();

const wss = new WebSocket.Server({port : 8080 })

wss.on('connection' , function connection(ws) {
    ws.on('message', function message(data){
        console.log("message :",data.toString())
        ws.send(`${data.toString()}`);
    })
})

app.get("/", (req,res)=>{
    res.send( "<h1>Chat Application</h1>");
})

app.listen(3000,()=>{
    console.log("App is running at the server 3000");
})