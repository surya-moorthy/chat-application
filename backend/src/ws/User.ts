import { WebSocket } from "ws";

interface User {
    socket: WebSocket,
    userId : string
}


export class UserManager {
    private users : Map<string,User> = new Map();

    setUserSocket(username : string,userId : string , socket : WebSocket){
        const user : User = {
            socket : socket,
            userId : userId
        }
       this.users.set(username,user);
    }
    getUserSocket(username : string): User | undefined{
       return this.users.get(username);
    }
    removeUserSocket(username : string) {
        this.users.delete(username)
    }
}