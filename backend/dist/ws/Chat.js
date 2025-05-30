"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
class Chat {
    constructor(rooms, userManager) {
        this.rooms = new Map();
        this.rooms = rooms;
        this.userManager = userManager;
    }
    handleMessages(user) {
        user.socket.on("message", (msg) => {
            let data;
            try {
                data = JSON.parse(msg.toString());
            }
            catch (err) {
                return user.socket.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
            }
            switch (data.type) {
                case "createChat":
                    this.CreateChat(user, data.user2);
                    break;
                case "joinChat":
                    this.JoinChat(user, data.roomId);
                    break;
                case "sendData":
                    this.SendChat(user, data.message);
                    break;
                default:
                    user.socket.send(JSON.stringify({ type: "error", message: "Unknown message type" }));
            }
        });
    }
    generateRoomId(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let roomId = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            roomId += characters[randomIndex];
        }
        return roomId;
    }
    CreateChat(user, user2) {
        const roomId = this.generateRoomId(16);
        this.rooms.set(roomId, new Set([user]));
        this.userManager.setUserSocket(user.username, user.userId, user.socket);
        user.socket.send(JSON.stringify({ type: "JoinChat", roomId, createdBy: user.username, invited: user2 }));
    }
    JoinChat(user, roomId) {
        const room = this.rooms.get(roomId);
        if (room) {
            room.add(user);
            this.userManager.setUserSocket(user.username, user.userId, user.socket);
            user.socket.send(JSON.stringify({ type: "joined", roomId }));
        }
        else {
            user.socket.send(JSON.stringify({ type: "error", message: "Room not found" }));
        }
    }
    SendChat(sender, message) {
        var _a;
        const roomId = (_a = [...this.rooms.entries()].find(([_, users]) => users.has(sender))) === null || _a === void 0 ? void 0 : _a[0];
        if (!roomId)
            return;
        const roomUsers = this.rooms.get(roomId);
        roomUsers === null || roomUsers === void 0 ? void 0 : roomUsers.forEach((user) => {
            if (user !== sender) {
                user.socket.send(JSON.stringify({ type: "message", message }));
            }
        });
    }
    receiveChat(user) {
        user.socket.on("message", (message) => {
            try {
                console.log(message.toString());
                const data = JSON.parse(message.toString());
                if (data.type == "message") {
                    const response = {
                        type: "acknowledge",
                        message: "Data received successfully"
                    };
                }
            }
            catch (error) {
                console.error("Invalid JSON message:", message);
                user.socket.send(JSON.stringify({
                    type: "error",
                    message: "Invalid JSON format"
                }));
            }
        });
    }
}
exports.Chat = Chat;
