import { WebSocketServer } from "ws";
import { wss } from "..";
import { Chat } from "./Chat";
import { UserManager } from "./User";

const user = new UserManager();
wss.on("connection",async (socket)=>{
    socket.on('error', console.error);
    socket.on('message', function message(data, isBinary) {
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(data, { binary: isBinary });
          }
        });
      });
})