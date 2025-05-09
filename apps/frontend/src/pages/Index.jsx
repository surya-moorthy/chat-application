import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Index() {
  const [friend,setFriend] = useState("");
  const [ws,setWs] = useState(null);
  const navigate = useNavigate();
  function handleSubmit() {
        if(friend !== ""){
          console.log(friend); 
          navigate("/chat")
        }
  }
  useEffect(()=>{
     const socket = new WebSocket("ws://localhost:4000");
     socket.onopen = ()=> {console.log("User Connected");} 
     socket.onmessage = ()=>{
         const chat = {
          type : "createChat",
          data : {
            socket : socket,
            userId : 1,
            username : "surya",
            joinuser : friend
          }
         }
         socket.send(JSON.stringify(chat));
     }
     setWs(socket); 
     socket.onclose = () => {
      console.log("user disconnected")
     }
  },[])
  return (
   <div className="flex justify-center h-screen items-center bg-neutral-300 p-4">
        <div className="flex flex-col bg-neutral-100 w-full max-w-2xl h-full max-h-1/2 p-8 space-y-5">
           <h2 className="flex-1 text-2xl text-center font-extrabold">
                Make A temparory Chat with your friend
           </h2>
           <div className="flex flex-col w-full h-56 justify-center space-y-2">
              <label htmlFor="friend" className="text-xl font-bold">Enter the Name:</label>
              <input 
              name="friend" 
              type="text" 
              placeholder="provide name of your friend" 
              className="border border-neutral-500 hover:border-neutral-600 p-3 text-lg"
              onChange={(event)=>{setFriend(event.target.value)}}
              />
                <button 
                className="w-32 px-4 py-2 text-white text-lg bg-neutral-950 hover:bg-neutral-900 font-bold font-serif cursor-pointer"
                onClick={handleSubmit}
                >
                        Chat
                </button>
           </div>
        </div>
   </div>
  )
}

// chat with your friend 
// enter your friends name 
// go to chat and wait until your friend joins
