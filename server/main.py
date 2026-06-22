from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import json

from database import (
    users_collection,
    messages_collection,
    friends_collection,
    friend_requests_collection
)

app = FastAPI()

# ================= CORS =================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://vishalsingh633.github.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= MODELS =================

class User(BaseModel):
    username: str
    email: str
    password: str


class Message(BaseModel):
    sender: str
    receiver: str
    message: str


class FriendRequest(BaseModel):
    sender: str
    receiver: str


# ================= HOME =================

@app.get("/")
def home():
    return {"message": "Chat backend is running"}


@app.get("/api")
def api():
    return {"message": "Connectly backend working"}

# ================= AUTH =================

@app.post("/signup")
def signup(user: User):

    existing_user = users_collection.find_one(
        {"email": user.email}
    )

    if existing_user:
        return {
            "success": False,
            "message": "Email already exists"
        }

    users_collection.insert_one(
        user.model_dump()
    )

    return {
        "success": True,
        "message": "User registered successfully"
    }


@app.post("/login")
def login(user: User):

    existing_user = users_collection.find_one({
        "email": user.email,
        "password": user.password
    })

    if existing_user:
        return {
            "success": True,
            "message": "Login successful"
        }

    return {
        "success": False,
        "message": "Invalid credentials"
    }


# ================= USERS =================

@app.get("/users")
def get_users():

    users = list(
        users_collection.find(
            {},
            {
                "_id": 0,
                "password": 0
            }
        )
    )

    return users


# ================= FRIEND REQUESTS =================

@app.post("/send-request")
def send_request(req: FriendRequest):

    if req.sender == req.receiver:
        return {
            "success": False,
            "message": "Cannot add yourself"
        }

    user = users_collection.find_one(
        {"email": req.receiver}
    )

    if not user:
        return {
            "success": False,
            "message": "User not found"
        }

    existing = friend_requests_collection.find_one({
        "sender": req.sender,
        "receiver": req.receiver
    })

    if existing:
        return {
            "success": False,
            "message": "Request already sent"
        }

    friend_requests_collection.insert_one({
        "sender": req.sender,
        "receiver": req.receiver,
        "status": "pending",
        "createdAt": datetime.utcnow()
    })

    return {
        "success": True,
        "message": "Friend request sent"
    }


@app.get("/requests/{email}")
def get_requests(email: str):

    requests = list(
        friend_requests_collection.find(
            {
                "receiver": email,
                "status": "pending"
            },
            {
                "_id": 0
            }
        )
    )

    return requests


@app.post("/accept-request")
def accept_request(req: FriendRequest):

    friend_requests_collection.update_one(
        {
            "sender": req.sender,
            "receiver": req.receiver
        },
        {
            "$set": {
                "status": "accepted"
            }
        }
    )

    friends_collection.insert_one({
        "userEmail": req.sender,
        "friendEmail": req.receiver
    })

    friends_collection.insert_one({
        "userEmail": req.receiver,
        "friendEmail": req.sender
    })

    return {
        "success": True,
        "message": "Friend request accepted"
    }


# ================= FRIENDS =================

@app.get("/friends/{email}")
def get_friends(email: str):

    friends = list(
        friends_collection.find(
            {"userEmail": email},
            {"_id": 0}
        )
    )

    return friends


# ================= MESSAGES =================

@app.post("/send-message")
def send_message(msg: Message):

    message_data = {
        "sender": msg.sender,
        "receiver": msg.receiver,
        "message": msg.message,
        "timestamp": datetime.utcnow()
    }

    messages_collection.insert_one(
        message_data
    )

    return {
        "success": True,
        "message": "Message sent"
    }


@app.get("/messages/{sender}/{receiver}")
def get_messages(
    sender: str,
    receiver: str
):

    messages = list(
        messages_collection.find(
            {
                "$or": [
                    {
                        "sender": sender,
                        "receiver": receiver
                    },
                    {
                        "sender": receiver,
                        "receiver": sender
                    }
                ]
            },
            {
                "_id": 0
            }
        )
    )

    return messages


# ================= PRIVATE WEBSOCKET CHAT =================

active_users = {}


@app.websocket("/ws/{email}")
async def websocket_endpoint(
    websocket: WebSocket,
    email: str
):

    await websocket.accept()

    active_users[email] = websocket

    try:

        while True:

            data = await websocket.receive_text()

            msg = json.loads(data)

            receiver = msg["receiver"]

            # send to receiver
            if receiver in active_users:
                await active_users[
                    receiver
                ].send_text(data)

            # send back to sender
            if email in active_users:
                await active_users[
                    email
                ].send_text(data)

    except WebSocketDisconnect:

        active_users.pop(
            email,
            None
        )
