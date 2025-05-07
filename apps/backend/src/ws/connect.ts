import { WebSocketServer } from "ws";

const wss = new WebSocketServer({
    port : 8080,
    host : "localhost",
    path : `/chat`,
    verifyClient: (info, done) => {
      console.log('Incoming connection from origin:', info.origin);
      done(true); // Accept connection
    },
})

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