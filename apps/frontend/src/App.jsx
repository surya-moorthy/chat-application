import  { BrowserRouter,Route, Routes } from "react-router-dom";
import Chat from "./pages/Chat";
import Chatrewrite from "./pages/Chatrewite";

function App(){
  return (
    <BrowserRouter>
    <Routes>
       <Route path="/chat" element={<Chat/>}/>
       <Route path="/chatroom" element={<Chatrewrite/>}/>

    </Routes>
    </BrowserRouter>
  )
}

export default App;
