"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
class UserManager {
    constructor() {
        this.users = new Map();
    }
    setUserSocket(username, userId, socket) {
        const user = {
            socket: socket,
            userId: userId
        };
        this.users.set(username, user);
    }
    getUserSocket(username) {
        return this.users.get(username);
    }
    removeUserSocket(username) {
        this.users.delete(username);
    }
}
exports.UserManager = UserManager;
