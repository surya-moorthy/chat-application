
import { useRef } from 'react'
import './App.css'
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useState } from 'react';


function App() {
  const ws = useRef("");
  const message = useRef("");
  const [recentMessage,setMessage] = useState("");

  useEffect(()=>{
        const ClientSocket = io("ws://localhost:3000");
        ClientSocket.on("connection", (socket) =>{
          console.log("A user has been added:",socket.id)
        }) 
  },[])

  function updateMessage(newMessage){
    message.current = newMessage;
  }

  function SendData() {
    setMessage(message.current);
  }
  return (
    <div className="bg-gray-100">
         <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold">Real time Chat-App</h2>
            <div className='bg-white p-4 h-64 overflow-auto mb-4'>{recentMessage}</div>
            <input type="text" className="border p-2 w-full" onChange={(e)=>updateMessage(e.target.value)}/>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={SendData}>
                Send
             </button>
         </div>
    </div>
  )
}

export default App
