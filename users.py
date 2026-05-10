from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from datetime import datetime

import os

# --------------------------------------------------
# LOAD ENV
# --------------------------------------------------

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
# --------------------------------------------------
# FASTAPI
# --------------------------------------------------

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
class ExperienceRequest(BaseModel):
    
    user_id: str

    destination: str

    start_date: str

    end_date: str

    user_experience: str

# --------------------------------------------------
# MONGODB
# --------------------------------------------------

client = AsyncIOMotorClient(MONGO_URL)

db = client["traveloop"]

# --------------------------------------------------
# USER MODEL
# --------------------------------------------------

class UserRegister(BaseModel):

    first_name: str
    last_name: str

    email: EmailStr

    phone_number: str

    city: str
    country: str

    additional_information: str

# --------------------------------------------------
# REGISTER USER
# --------------------------------------------------

@app.post("/register-user")

async def register_user(user: UserRegister):

    try:

        # ------------------------------------------
        # CHECK EXISTING EMAIL
        # ------------------------------------------

        existing_user = await db.users.find_one({
            "email": user.email
        })

        if existing_user:

            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        # ------------------------------------------
        # PREPARE USER DATA
        # ------------------------------------------

        user_data = {

            "first_name": user.first_name,

            "last_name": user.last_name,

            "email": user.email,

            "phone_number": user.phone_number,

            "city": user.city,

            "country": user.country,

            "additional_information":
                user.additional_information
        }

        # ------------------------------------------
        # INSERT INTO MONGODB
        # ------------------------------------------

        result = await db.users.insert_one(user_data)

        # ------------------------------------------
        # RESPONSE
        # ------------------------------------------

        return {

            "message": "User registered successfully",

            "user_id": str(result.inserted_id)
        }

    except Exception as e:

        print("ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
@app.post("/share-experience")

async def share_experience(request: ExperienceRequest):

    try:

        # ------------------------------------------
        # CHECK USER EXISTS
        # ------------------------------------------

        existing_user = await db.users.find_one({

            "_id": ObjectId(request.user_id)

        })

        if not existing_user:

            raise HTTPException(

                status_code=404,

                detail="User not found"
            )

        # ------------------------------------------
        # PREPARE EXPERIENCE DATA
        # ------------------------------------------

        experience_data = {

            "user_id": request.user_id,

            "destination": request.destination,

            "start_date": request.start_date,

            "end_date": request.end_date,

            "user_experience": request.user_experience,

            "created_at": str(datetime.now())
        }

        # ------------------------------------------
        # SAVE TO MONGODB
        # ------------------------------------------

        result = await db.experiences.insert_one(
            experience_data
        )

        # ------------------------------------------
        # RESPONSE
        # ------------------------------------------

        return {

            "message": "Experience shared successfully",
        }

    except Exception as e:

        print("ERROR:", str(e))

        raise HTTPException(

            status_code=500,

            detail=str(e)
        )        
<<<<<<< HEAD
        
=======
        
>>>>>>> origin/Rohit
