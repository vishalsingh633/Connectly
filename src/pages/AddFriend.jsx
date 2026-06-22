import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../style/addfriend.css"
export default function AddFriend() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
 const navigate = useNavigate();
 const currentUser =
  localStorage.getItem("email") ||
  "test@gmail.com";
const sendRequest = async () => {
  console.log("Current User:", currentUser);
  console.log("Receiver:", email);

  try {
    const res = await API.post("/send-request", {
      sender: currentUser,
      receiver: email,
    });

    console.log(res.data);

    setMessage(res.data.message);
    setEmail("");
  } catch (error) {
    console.log("ERROR:", error.response?.data);
    setMessage("Failed to send request");
  }
};

  return (
    <div className="add-friend-page">
      <h2>Add Friend</h2>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={sendRequest}>
        Send Request
      </button>

      {message && <p>{message}</p>}

       <button 
        style={{
            padding: "10px",
            margin:"50px",
            gap: "10px",
            background:"red",
          }}

            onClick={() =>
              navigate(
          "/chat"
              )
            }
          >
            Back
         </button>
    </div>
  );
}