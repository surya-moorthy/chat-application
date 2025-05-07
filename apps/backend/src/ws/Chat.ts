import { WebSocket } from "ws";
import { UserManager } from "./User";

interface User {
    socket: WebSocket,
    userId : string,
    username : string
}

export class Chat {
     private roomId : string;
     private userManager: UserManager;

     constructor(roomId : string,userManager: UserManager){
        this.roomId = roomId; 
        this.userManager = userManager;
     }
     CreateChat(user: User , user2 : string,name : string){
     function generateRoomId(length: number): string {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let roomId = '';
            
            for (let i = 0; i < length; i++) {
              const randomIndex = Math.floor(Math.random() * characters.length);
              roomId += characters[randomIndex];
            }
            
            return roomId;
          }
         user.socket.on("message",(message)=>{
            try {
                const data = JSON.parse(message.toString());
                if(data.type == "createChat"){
                    const roomId = generateRoomId(16);
                    this.roomId = roomId;
                     const response = {
                        type : "JoinChat",
                        UserCreatedChat : user.username,
                        UserJoinedChat : user2,
                     }
                     user.socket.send(JSON.stringify(response))
                }
              
            }catch(error){
                console.error("Invalid JSON received:",message);
                user.socket.send(JSON.stringify({
                    type: "error",
                    message: "Invalid JSON format"
                }));
            }
         })
     }
     JoinChat(user: User , name : string){
         user.socket.on("message",(message)=>{
            try {
                const data = JSON.parse(message.toString());
                if(data.type == "joinChat"){
                    const roomId = this.roomId
                     const response = {
                        type : "joined successfully",
                        roomId : roomId
                     }
                     user.socket.send(JSON.stringify(response))
                }

            }catch(error){
                console.error("Invalid JSON received:",message);
                user.socket.send(JSON.stringify({
                    type: "error",
                    message: "Invalid JSON format"
                }));
            }
         })
     }
     sendChat(user : User) {
         user.socket.on("message",(message)=>{
            try {
                const data = JSON.parse(message.toString());
            if(data.type === "sendData"){
                const response = {
                    type : "receiveData",
                    message : data.paload 
                }
                user.socket.send(JSON.stringify(response))
            }
            }catch(error){
                console.error("Invalid JSON received:",message);
                user.socket.send(JSON.stringify({
                    type: "error",
                    message: "Invalid JSON format"
                }));
            }
         })
     }
     receiveChat(user : User) {
        user.socket.on("message",(message)=>{
             try {
                console.log(message.toString());
                const data = JSON.parse(message.toString());
                if(data.type == "receiveData"){
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