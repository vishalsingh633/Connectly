import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../style/chatbox.css";
import settingIcon from "../assets/setting.png";
import chatIcon from "../assets/slack.png";
import logIcon from "../assets/logout.png";
import AddIcon from "../assets/join.png";
import reqIcon from "../assets/group.png";
import searchIcon from "../assets/people.png";

export default function Chat() {
  const navigate = useNavigate();

  const currentUser =
    localStorage.getItem("email");
const [mobileChatOpen, setMobileChatOpen] =useState(false);
  const [friends, setFriends] = useState([]);
  const [selectedUser, setSelectedUser] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [text, setText] = useState("");

  const socket = useRef(null);

  // ================= LOAD FRIENDS =================
  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      const res = await API.get(
        `/friends/${currentUser}`
      );

      const friendEmails = res.data.map(
        (f) => f.friendEmail
      );

      const usersRes =
        await API.get("/users");

      const friendUsers =
        usersRes.data.filter((user) =>
          friendEmails.includes(
            user.email
          )
        );

      setFriends(friendUsers);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= WEBSOCKET =================
  useEffect(() => {
    socket.current = new WebSocket(
      `ws://127.0.0.1:8000/ws/${currentUser}`
    );

    socket.current.onmessage = (
      event
    ) => {
      const data = JSON.parse(
        event.data
      );

      if (
        selectedUser &&
        (
          data.sender ===
            selectedUser.email ||
          data.receiver ===
            selectedUser.email
        )
      ) {
        setMessages((prev) => {
          const exists = prev.some(
            (msg) =>
              msg.sender ===
                data.sender &&
              msg.receiver ===
                data.receiver &&
              msg.message ===
                data.message
          );

          if (exists) return prev;

          return [...prev, data];
        });
      }
    };

    return () => {
      socket.current.close();
    };
  }, [selectedUser]);

  // ================= OPEN CHAT =================
const openChat = (user) => {
  setSelectedUser(user);

  if (window.innerWidth <= 768) {
    setMobileChatOpen(true);
  }

  const chatKey =
    `chat_${currentUser}_${user.email}`;

  const saved =
    localStorage.getItem(chatKey);

  if (saved) {
    setMessages(JSON.parse(saved));
  } else {
    setMessages([]);
  }
};
  // ================= SAVE CHAT =================
  useEffect(() => {
    if (!selectedUser) return;

    const chatKey =
      `chat_${currentUser}_${selectedUser.email}`;

    localStorage.setItem(
      chatKey,
      JSON.stringify(messages)
    );
  }, [messages, selectedUser]);

  // ================= SEND MESSAGE =================
  const sendMessage = () => {
    if (!text.trim()) return;

    if (!selectedUser) {
      alert("Select a friend first");
      return;
    }

    const msgData = {
      sender: currentUser,
      receiver:
        selectedUser.email,
      message: text,
    };

    // instant UI update
    setMessages((prev) => [
      ...prev,
      msgData,
    ]);

    socket.current.send(
      JSON.stringify(msgData)
    );

    setText("");
  };


  return (
  <div className="chat-container">

    {/* NAVIGATION */}
    <div className="navbar">

      <div className="nav-avatar">
        {currentUser?.[0]?.toUpperCase()}
      </div>

      <button
        className="nav-btn"
        onClick={() => navigate("/add-friend")}
      >
          <img
    src={AddIcon}
    alt="Settings"
    width="30"
    height="30"
  />
      </button>
   
      <button
        className="nav-btn"
        onClick={() => navigate("/requests")}
      >
          <img
    src={reqIcon}
    alt="Settings"
    width="35"
    height="35"
  />
      </button>

      <button className="nav-btn">
        <img
    src={settingIcon}
    alt="Settings"
    width="35"
    height="35"
  />
      </button>

      <button
        className="nav-btn logout-btn"
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
      >
        <img
    src={logIcon}
    alt="Settings"
    width="30"
    height="30"
  />
      </button>

    </div>

    {/* FRIEND LIST PANEL */}
   <div
  className={`friend-panel ${
    mobileChatOpen ? "hide-mobile" : ""
  }`}
>

<div className="friend-header">
  <h2>Chats</h2>

  <div className="search-wrapper">
    <img
      src={searchIcon}
      alt="Search"
      className="search-icon"
    />

    <input
      className="search-box"
      type="text"
      placeholder="Search Friend"
    />
  </div>
</div>

      <div className="friend-list">

        {friends.map((friend, i) => (
          <div
            key={i}
            className={`friend-card ${
              selectedUser?.email === friend.email
                ? "active"
                : ""
            }`}
            onClick={() => openChat(friend)}
          >

            <div className="friend-avatar">
              {friend.username?.[0]}
            </div>

            <div className="friend-info">
              <h4>{friend.username}</h4>
              <p>{friend.email}</p>
            </div>

          </div>
        ))}

      </div>

    </div>

    {/* CHAT AREA */}
    <div
  className={`chat-area ${
    mobileChatOpen ? "show-mobile" : ""
  }`}
>

      {!selectedUser ? (

        <div className="empty-chat">

          <div className="empty-chat-content">
            <h1><img
    src={chatIcon}
    alt="Settings"
    width="250"
    height="250"
  /></h1>
            <h2>Select a Chat</h2>
            <p>
              Choose a friend from the list to
              start chatting.
            </p>
          </div>

        </div>

      ) : (

        <>
          <div className="chat-header">
{window.innerWidth <= 768 && (
  <button
    className="back-btn"
    onClick={() =>
      setMobileChatOpen(false)
    }

          style={{
           
           position:"relative",
           left:"90%",
           top:"45%",
            background:"red",
            border: "none",
           borderRadius: "12px",
           fontSize: "16px",
  fontWeight: "bold"
          }}
  >
    ←
  </button>
)}
            <div className="header-user">

              <div className="friend-avatar">
                {selectedUser.username?.[0]}
              </div>

              <div>
                <h3>
                  {selectedUser.username}
                </h3>

                <div className="status">
                  <span className="online-dot"></span>
                  Online
                </div>
              </div>

            </div>

          </div>

          <div className="messages">

            {messages.map((msg, i) => (
              <div
                key={i}
              className={`message ${
  msg.sender === currentUser
    ? "sent"
    : "received"
}`}
              >
                {msg.message}
              </div>
            ))}

          </div>

          <div className="message-input">

            <button className="icon-btn">
              😀
            </button>

            <button className="icon-btn">
              📎
            </button>

            <button className="icon-btn">
              🎤
            </button>

            <input
              type="text"
              value={text}
              placeholder="Type a message..."
              onChange={(e) =>
                setText(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button
              className="send-btn"
              onClick={sendMessage}
            >
              ➤
            </button>

          </div>
        </>
      )}

    </div>

  </div>
);
}