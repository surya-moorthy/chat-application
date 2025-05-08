import { useState } from "react"

export default function Chatrewrite() {
  const [input,setInput] = useState("")
  const [messages,setMessages] = useState([]);

  function handleClick () {
      if(input.trim() === "") return;
      setMessages(prev => [...prev,input])
      setInput("");
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen p-4 bg-neutral-100">
          <h2 className="p-4 text-3xl w-full">
                Chat
          </h2>
          <div className=" flex flex-col w-full max-w-2xl h-3/4 bg-white">
               <div className="flex-1 overflow-y-auto mb-2 space-y-2 p-3">
                {messages.map((message,idx)=>{
                        return (
                            <div key={idx} className="bg-neutral-400 p-2 text-lg rounded-md w-fit">
                            
                                  {message}
                            </div>
                        )
                })}
               </div>
               <div className="p-4 flex items-center space-x-2">
                    <input type="text" onChange={(event)=>{setInput(event.target.value)}} 
                      onKeyDown={(event)=> {event.key === "Enter"  && handleClick()}}
                    className="border w-full max-w-3/4 h-12 py-2 px-4 p text-xl rounded"/>
                        <button 
                        className="bg-neutral-800 hover:bg-neutral-900 px-4 py-2 text-neutral-50 text-lg rounded cursor-pointer"
                        onClick={handleClick}>
                        Send
                        </button> 
               </div> 
          </div>
    </div>
  )
} 
