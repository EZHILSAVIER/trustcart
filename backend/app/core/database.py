from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_DETAILS", "mongodb://localhost:27017")

# Set timeout to 3 seconds so requests don't hang if DB is missing
client = AsyncIOMotorClient(MONGO_DETAILS, serverSelectionTimeoutMS=3000)
database = client.compliance_db

async def get_database():
    return database
