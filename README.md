# chat-application

# Building an chat application based on the inspiration of whatsapp , facebook and Zoom 
This journey is fully based on the system design concepts and learnings based on applications and challenges of websockets.


## WebSockets using ws library 
  ### handle WebSocket connections
  - A WebSocket Server needs to be initialized to handle all the websocket connections 
  ```
    const wss = new Websocket.server({port : 8080})
    wss.on('connections', function connections(ws){
        ....
    })
    
  ```