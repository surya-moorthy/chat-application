"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const ws_1 = require("ws");
const url_1 = __importDefault(require("url"));
const uuidv4 = require("uuid").v4;
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const wsServer = new ws_1.WebSocketServer({ server });
const connections = {};
const users = {};
const broadcast = () => {
    Object.keys(connections).forEach(uuid => {
        const connection = connections[uuid];
        const message = JSON.stringify(users);
        connection.send(message);
    });
};
const handleMessage = (bytes, uuid) => {
    const data = JSON.parse(bytes.toString());
    const user = users[uuid];
    user.state = data;
    broadcast();
};
const handleClose = (uuid) => {
    delete connections[uuid];
    delete users[uuid];
    broadcast();
};
wsServer.on("connection", (connection, request) => {
    const { username } = url_1.default.parse(request.url, true).query;
    const uuid = uuidv4();
    console.log(username);
    console.log(uuid);
    connections[uuid] = connection;
    users[uuid] = {
        username,
        state: {}
    };
    connection.on("message", message => handleMessage(message, uuid));
    connection.on("close", () => handleClose(uuid));
});
const port = 8000;
server.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
