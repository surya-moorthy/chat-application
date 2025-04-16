import { useEffect, useState } from 'react'
import './App.css'
import io from "socket.io-client";
const socket = io("http://localhost:3000"); 

function App() {
  const [message,setMessage] = useState("");
  const [chatMessages,setChatMessages] = useState([]);

  useEffect(()=>{
    socket.on("message",(message)=>{
      console.log("server sent a message:",message);
    })
  });
  useEffect(()=>{
    socket.on("ClientMessage",(msg)=>{
      setChatMessages((preveMessages)=> [...preveMessages,msg])
    })
  })
  const SendMessage = ()=>{
    socket.emit(message);
    setChatMessages((preveMessages)=> [...preveMessages,message]);
    setMessage('');
  }
  return (
    <div className="max-w-xl mx-auto p-4 bg-gray-100 min-h-screen flex flex-col justify-center items-center">
  {/* Chat Box */}
  <div className="w-full bg-white rounded-xl shadow-lg p-6 space-y-4">
    
    {/* Chat Messages */}
    <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-2">
      {chatMessages.map((chatMessage, index) => (
        <p key={index} className="text-gray-800 text-base bg-white px-4 py-2 rounded-lg shadow-sm w-fit max-w-xs">
          {chatMessage}
        </p>
      ))}
    </div>

    {/* Input + Button */}
    <div className="flex gap-2">
      <input
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={SendMessage}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Send
      </button>
    </div>

  </div>
</div>

  )
}

export default App
