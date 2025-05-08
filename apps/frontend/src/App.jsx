import  { BrowserRouter,Route, Routes } from "react-router-dom";
import Chat from "./pages/Chat";
import Chatrewrite from "./pages/Chatrewite";
import Index from "./pages/Index";

function App(){
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index/>}/>
       <Route path="/chat" element={<Chat/>}/>
       <Route path="/chatroom" element={<Chatrewrite/>}/>

    </Routes>
    </BrowserRouter>
  )
}

export default App;
