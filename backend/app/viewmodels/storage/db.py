import os
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env')))

from pymongo import MongoClient

client = MongoClient(os.getenv("MONGO_URI"))
db = client["indradhanu"]

def save_weather(data):
    db.weather.insert_one(data)
