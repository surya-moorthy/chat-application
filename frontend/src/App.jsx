import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

function App() {
  const [recentMessage , setRecentMessage] = useState("");
  const message = useRef("");
  const ws = useRef(null);

  function updateMessage(newMessage) {
    message.current = newMessage;
  }
  function SendData() {
    setRecentMessage(message.current);
    ws.current.send(message.current);
  }

  useEffect(()=>{
     ws.current = new WebSocket(`ws://localhost:8080`);
    ws.current.onmessage = (event) =>{
      message.current = event.data;
    }
    ws.current.onerror = (error) =>{
      console.error("Websocket Error:",error);
    }
    ws.current.onclose = () =>{
      console.log("Connection Closed");
    }
    return () =>{
      ws.current.close
    }
  })

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
