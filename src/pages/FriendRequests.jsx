import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../style/request.css";
export default function FriendRequests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("email");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const res = await API.get(
      `/requests/${currentUser}`
    );

    setRequests(res.data);
  };

  const acceptRequest = async (sender) => {
    await API.post("/accept-request", {
      sender,
      receiver: currentUser,
    });

    loadRequests();
  };

  return (
 

    <div className="requests-page">
      <h2>Friend Requests</h2>

      {requests.length === 0 && (
        <p>No requests</p>
      )}
    <button

      style={{
            padding: "12px",
            margin:"50px",
            gap: "10px",
            background:"red",
            border: "none",
           borderRadius: "12px",
           fontSize: "16px",
  fontWeight: "bold"
          }}

            onClick={() =>
              navigate(
          "/chat"
              )
            }
          >
            Back
         </button>
      {requests.map((req, index) => (
        <div
          key={index}
          className="request-card"
        >
          <h4>{req.sender}</h4>

          <button
            onClick={() =>
              acceptRequest(req.sender)
            }
          >
            Accept
          </button>
        </div>
      ))}
    </div>
  );
}