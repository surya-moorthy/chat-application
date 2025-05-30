"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleConnection = void 0;
const Chat_1 = require("./Chat");
const User_1 = require("./User");
const userManager = new User_1.UserManager();
const rooms = new Map();
const chat = new Chat_1.Chat(rooms, userManager);
const handleConnection = (socket, req) => {
    try {
        const userId = extractUserFromRequest(req); // assume JWT token or similar
        const username = `User-${Math.floor(Math.random() * 10000)}`;
        const user = {
            socket,
            userId,
            username,
        };
        console.log(`[CONNECTED] ${username} (${userId})`);
        chat.handleMessages(user);
        socket.on("close", () => {
            console.log(`[DISCONNECTED] ${userId}`);
            userManager.removeUserSocket(username);
        });
    }
    catch (err) {
        console.error("WebSocket connection error:", err);
        socket.close();
    }
};
exports.handleConnection = handleConnection;
function extractUserFromRequest(req) {
    const token = req.headers["sec-websocket-protocol"];
    // TODO: verify token using JWT and extract userId
    return token; // mock for now
}
