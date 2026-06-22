import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from './pages/login.jsx'
import Sign from './pages/signup.jsx'
import Chat from "./pages/chatbox.jsx";
import AddFriend from "./pages/AddFriend";
import FriendRequests from "./pages/FriendRequests";
import Friends from "./pages/Friend.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Routes>
      <Route path="/" element={<Sign/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Sign />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/friends" element={<Friends />}
/>
      <Route
  path="/add-friend"
  element={<AddFriend />}
/>

<Route
  path="/requests"
  element={<FriendRequests />}
/>
    </Routes>
    </>
  )
}

export default App
