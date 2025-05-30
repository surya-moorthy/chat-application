import express from "express";
import {createServer} from "http";
import WebSocket ,{ WebSocketServer} from "ws";

import url from "url";
const uuidv4 = require("uuid").v4;

const app = express();
const server = createServer(app);
const wsServer = new WebSocketServer({ server });

const connections: { [uuid: string]: WebSocket } = {};
const users: { [uuid: string]: { username: string | string[] | undefined; state: object } } = {};

const broadcast = () =>{
    Object.keys(connections).forEach(uuid => {
        const connection = connections[uuid];
        const message = JSON.stringify(users);
        connection.send(message);
    })
}

const handleMessage = (bytes : WebSocket.RawData, uuid : string) => {
   const data = JSON.parse(bytes.toString());
   const user = users[uuid];
   user.state = data;

   broadcast();
   
}

const handleClose = (uuid : string) => {

    delete connections[uuid];
    delete users[uuid];

    broadcast();
}

wsServer.on("connection",(connection , request)=>{
    const {username} = url.parse(request.url as string, true).query;
    const uuid = uuidv4()
    console.log(username);
    console.log(uuid);

    connections[uuid] = connection;
    users[uuid] = {
        username,
        state : { }
    }

    connection.on("message",message => handleMessage(message,uuid));
    connection.on("close",()=>handleClose(uuid));
})

const port = 8000

server.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})