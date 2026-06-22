from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))

try:
    client.admin.command("ping")
    print("MongoDB Connected Successfully")
except Exception as e:
    print("MongoDB Connection Error:", e)

db = client["chatapp"]

users_collection = db["users"]

messages_collection = db["messages"]


friends_collection = db["friends"]

friend_requests_collection = db["friend_requests"]