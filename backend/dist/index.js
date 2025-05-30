"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const ws_1 = require("ws");
const connect_1 = require("./ws/connect");
const uuidv4 = require("uuid").v4;
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const wsServer = new ws_1.WebSocketServer({ server });
wsServer.on("connection", connect_1.handleConnection);
// const connections: { [uuid: string]: WebSocket } = {};
// const users: { [uuid: string]: { username: string | string[] | undefined; state: object } } = {};
// const broadcast = () =>{
//     Object.keys(connections).forEach(uuid => {
//         const connection = connections[uuid];
//         const message = JSON.stringify(users);
//         connection.send(message);
//     })
// }
// const handleMessage = (bytes : WebSocket.RawData, uuid : string) => {
//    const data = JSON.parse(bytes.toString());
//    const user = users[uuid];
//    user.state = data;
//    if (data.type == "join_room") {
//    }
//    else if (data.type == "")
//    broadcast();
// }
// const handleClose = (uuid : string) => {
//     delete connections[uuid];
//     delete users[uuid];
//     broadcast();
// }
// wsServer.on("connection",(connection , request)=>{
//     const {username} = url.parse(request.url as string, true).query;
//     const protocol = request.headers['sec-websocket-protocol'];
//     console.log("protocol:",protocol);
//     const uuid = uuidv4()
//     console.log(username);
//     console.log(uuid);
//     connections[uuid] = connection;
//     users[uuid] = {
//         username,
//         state : { }
//     }
//     server.on('upgrade', (req, socket, head) => {
//     const protocols = req.headers['sec-websocket-protocol']; 
//     const selected = protocols?.split(',').map(p => p.trim()).includes('json') ? 'json' : null;
//       wsServer.handleUpgrade(req, socket, head, (ws) => {
//       ws.protocol = selected as string;
//       wsServer.emit('connection', ws, req);
//     socket.write(`HTTP/1.1 101 Switching Protocols\r\n` +
//         `Upgrade: websocket\r\n` +
//         `Connection: Upgrade\r\n` +
//         `Sec-WebSocket-Protocol: ${selected}\r\n` +
//         `\r\n`);
//   });
//     });
//     connection.on("message",message => handleMessage(message,uuid));
//     connection.on("close",()=>handleClose(uuid));
// })
const port = 8000;
server.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
