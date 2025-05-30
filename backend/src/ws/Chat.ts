import { WebSocket } from "ws";
import { UserManager } from "./User";

interface User {
    socket: WebSocket,
    userId : string,
    username : string
}

export class Chat {
    private rooms: Map<string, Set<User>> = new Map();
    private userManager: UserManager;

     constructor(rooms : Map<string,Set<User>>,userManager: UserManager){
        this.rooms = rooms; 
        this.userManager = userManager;
     }

     public handleMessages(user: User) {
        user.socket.on("message", (msg) => {
            let data;
            try {
                data = JSON.parse(msg.toString());
            } catch (err) {
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
    private generateRoomId(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let roomId = '';
        
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          roomId += characters[randomIndex];
        }
        
        return roomId;
      }
    
      private CreateChat(user: User, user2: string) {
        const roomId = this.generateRoomId(16);
        this.rooms.set(roomId, new Set([user]));
        this.userManager.setUserSocket(user.username, user.userId, user.socket);
        user.socket.send(JSON.stringify({ type: "JoinChat", roomId, createdBy: user.username, invited: user2 }));
    }

    private JoinChat(user: User, roomId: string) {
        const room = this.rooms.get(roomId);
        if (room) {
            room.add(user);
            this.userManager.setUserSocket(user.username, user.userId, user.socket);
            user.socket.send(JSON.stringify({ type: "joined", roomId }));
        } else {
            user.socket.send(JSON.stringify({ type: "error", message: "Room not found" }));
        }
    }

    private SendChat(sender: User, message: string) {
        const roomId = [...this.rooms.entries()].find(([_, users]) => users.has(sender))?.[0];
        if (!roomId) return;

        const roomUsers = this.rooms.get(roomId);
        roomUsers?.forEach((user) => {
            if (user !== sender) {
                user.socket.send(JSON.stringify({ type: "message", message }));
            }
        });
    }
     receiveChat(user : User) {
        user.socket.on("message",(message)=>{
             try {
                console.log(message.toString());
                const data = JSON.parse(message.toString());
                if(data.type == "message"){
                    const response = {
                        type: "acknowledge",
                        message: "Data received successfully"
                    };    
                }
             }catch(error) {
                console.error("Invalid JSON message:",message);
                user.socket.send(JSON.stringify({
                    type: "error",
                    message: "Invalid JSON format"
                }));
             }
        })

     }
}

