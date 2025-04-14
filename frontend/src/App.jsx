import { useRef, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

function App() {
  const socketRef = useRef(null);     
  const messageRef = useRef("");     
  const [recentMessage, setRecentMessage] = useState(""); 

  useEffect(() => {

    const socket = io("http://localhost:4000"); 
    socketRef.current = socket;
    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
    });
    socket.on("receive_message", (data) => {
      setRecentMessage(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  const updateMessage = (newMessage) => {
    messageRef.current = newMessage;
  };
  
  // Emit message to server
  const SendData = () => {
    if (socketRef.current && messageRef.current.trim() !== "") {
      socketRef.current.emit("send_message", messageRef.current);
      messageRef.current = ""; // clear ref after sending
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Real-time Chat App</h2>
        <div className="bg-white p-4 h-64 overflow-auto mb-4">
          <p>{recentMessage}</p>
        </div>
        <input
          type="text"
          className="border p-2 w-full mb-2"
          placeholder="Type a message..."
          onChange={(e) => updateMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={SendData}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
