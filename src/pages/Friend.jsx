import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../style/friend.css";

export default function Friend() {
  const navigate = useNavigate();

  const currentUser =
    localStorage.getItem("email");

  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState("");

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

  const filteredFriends =
    friends.filter(
      (friend) =>
        friend.username
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        friend.email
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const openChat = (friend) => {
    localStorage.setItem(
      "selectedFriend",
      JSON.stringify(friend)
    );

    navigate("/chat");
  };

  return (
    <div className="friends-container">

      <div className="friends-header">
        <h2>My Friends</h2>

        <p>
          Welcome {currentUser}
        </p>
      </div>

      <div className="top-actions">

        <button
          className="add-btn"
          onClick={() =>
            navigate("/add-friend")
          }
        >
          + Add Friend
        </button>

        <button
          className="request-btn"
          onClick={() =>
            navigate("/requests")
          }
        >
          🔔 Requests
        </button>

      </div>

      <div className="search-box">

        <input
          type="text"
          placeholder="Search friends..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

      </div>

      <div className="friends-list">

        {filteredFriends.map(
          (friend, i) => (
            <div
              key={i}
              className="friend-card"
              onClick={() =>
                openChat(friend)
              }
            >
              <div className="friend-avatar">
                {
                  friend.username?.[0]
                }
              </div>

              <div className="friend-info">
                <h3>
                  {
                    friend.username
                  }
                </h3>

                <p>
                  {friend.email}
                </p>
              </div>

              <div className="chat-arrow">
                ➜
              </div>
            </div>
          )
        )}

      </div>

      <button
        className="logout-btn"
        onClick={() => {
          localStorage.clear();
          window.location.href =
            "/";
        }}
      >
        Logout
      </button>

    </div>
  );
}