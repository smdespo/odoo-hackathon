from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
import os
from datetime import datetime, timedelta
import random

# ─── SETUP ───
load_dotenv()

FOURSQUARE_API_KEY = os.getenv("FOURSQUARE_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not FOURSQUARE_API_KEY or not GROQ_API_KEY:
    raise RuntimeError("Missing API keys! Check your .env file.")

client = Groq(api_key=GROQ_API_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
lient = AsyncIOMotorClient(MONGO_URL)

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

# ─── MODELS ───
class PlaceRequest(BaseModel):       # only destination needed for /places
    destination: str

class TripRequest(BaseModel):        # destination + dates for /generate-catalog
    destination: str
    start_date: str
    end_date: str

class AutoPlanRequest(BaseModel):    # dates + catalog for /auto-plan
    start_date: str
    end_date: str
    catalog: dict

# ─── SHARED HELPERS ───
def geocode(destination):
    nom_url = f"https://nominatim.openstreetmap.org/search?q={destination}&format=json&limit=1"
    headers = {"User-Agent": "TraveloopHackathonApp/1.0"}
    geo_data = requests.get(nom_url, headers=headers, timeout=5).json()
    if not geo_data:
        raise HTTPException(status_code=404, detail="Destination not found.")
    return geo_data[0]["lat"], geo_data[0]["lon"]

def get_foursquare_places(lat, lon, limit=15):
    fsq_url = "https://places-api.foursquare.com/places/search"
    fsq_headers = {
        "Authorization": f"Bearer {FOURSQUARE_API_KEY}",
        "Accept": "application/json",
        "X-Places-Api-Version": "2025-06-17"
    }
    fsq_params = {
        "ll": f"{lat},{lon}",
        "sort": "POPULARITY",
        "limit": limit
    }
    return requests.get(fsq_url, headers=fsq_headers, params=fsq_params, timeout=5)

# ─── SYSTEM PROMPT FOR /places ───
PLACES_SYSTEM_PROMPT = """
You are an intelligent travel recommendation engine.

You will receive:
- destination
- coordinates
- a list of real places fetched from Foursquare

Your task:
1. Analyze the provided places.
2. Select the BEST top 6 places.
3. Prioritize popularity, tourist appeal, variety, uniqueness, travel experience quality.
4. Avoid repeating very similar categories if possible.
5. Generate concise descriptions.
6. Return ONLY valid JSON. Do NOT return markdown. Do NOT explain anything outside JSON.

Expected Output Format:
{
  "destination": "string",
  "top_places": [
    {
      "id": "1",
      "name": "string",
      "category": "string",
      "description": "string",
      "why_visit": "string"
    }
  ]
}

Rules:
- Return exactly 6 places.
- Keep descriptions short and realistic.
- Output must be valid JSON only.
"""

# ─── ENDPOINT 1: /places ───
@app.post("/places")
async def get_places(request: PlaceRequest):
    try:
        lat, lon = geocode(request.destination)

        fsq_response = get_foursquare_places(lat, lon)
        print("FSQ STATUS:", fsq_response.status_code)

        real_places = []
        if fsq_response.status_code == 200:
            for place in fsq_response.json().get("results", []):
                real_places.append({
                    "name": place.get("name", "Unknown"),
                    "category": place["categories"][0]["name"] if place.get("categories") else "General",
                    "address": place.get("location", {}).get("formatted_address", "No address"),
                    "distance_meters": place.get("distance", "Unknown")
                })
        else:
            raise HTTPException(
                status_code=fsq_response.status_code,
                detail=fsq_response.text
            )

        prompt_data = {
            "destination": request.destination,
            "coordinates": {"latitude": lat, "longitude": lon},
            "places": real_places
        }

        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": PLACES_SYSTEM_PROMPT},
                {"role": "user", "content": str(prompt_data)}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            response_format={"type": "json_object"}
        )

        ai_response = chat_completion.choices[0].message.content
        return json.loads(ai_response)

    except Exception as e:
        print("ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


# ─── ENDPOINT 2: /generate-catalog ───
@app.post("/generate-catalog")
async def generate_catalog(request: TripRequest):
    try:
        lat, lon = geocode(request.destination)

        # Weather
        weather_context = "Weather data temporarily unavailable."
        try:
            weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
            weather_data = requests.get(weather_url, timeout=3).json()
            current_temp = weather_data.get("current_weather", {}).get("temperature")
            if current_temp is not None:
                weather_context = f"The current temperature is {current_temp}°C."
        except Exception as weather_err:
            print(f"Weather API error (ignoring): {weather_err}")

        # Foursquare
        fsq_response = get_foursquare_places(lat, lon)
        real_places = []
        if fsq_response.status_code == 200:
            for place in fsq_response.json().get("results", []):
                name = place.get("name")
                cat = place["categories"][0]["name"] if place.get("categories") else "General"
                real_places.append(f"{name} ({cat})")
        else:
            real_places = ["No Foursquare data available. Use general popular places."]

        system_prompt = f"""
        You are an expert travel planner API. 
        The user is planning a trip to {request.destination} from {request.start_date} to {request.end_date}.
        {weather_context}
        
        Here is a list of REAL popular places in this location from Foursquare:
        {real_places}
        
        Your job is to organize these real places (and add a few logical famous ones if needed) into a JSON catalog.
        Categorize them into 'accommodation', 'dining', and 'activities'.
        For each place, generate a realistic estimated_cost (in USD) and a default_duration_hours (integer or float).
        
        You MUST return ONLY a valid JSON object matching this exact schema:
        {{
            "destination_meta": {{"weather_context": "string", "currency_used": "string"}},
            "catalog": {{
                "accommodation": [ {{"id": "string", "title": "string", "description": "string", "estimated_cost": 250, "default_duration_hours": 24, "category": "accommodation"}} ],
                "dining": [ {{"id": "string", "title": "string", "description": "string", "estimated_cost": 45, "default_duration_hours": 2, "category": "dining"}} ],
                "activities": [ {{"id": "string", "title": "string", "description": "string", "estimated_cost": 25, "default_duration_hours": 3, "category": "activity"}} ]
            }}
        }}
        """

        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "Generate the catalog JSON now."}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            response_format={"type": "json_object"}
        )

        ai_response = chat_completion.choices[0].message.content
        return json.loads(ai_response)

    except Exception as e:
        print(f"FATAL Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ─── ENDPOINT 3: /auto-plan ───
@app.post("/auto-plan")
async def auto_plan_itinerary(request: AutoPlanRequest):
    try:
        start = datetime.strptime(request.start_date, "%Y-%m-%d")
        end = datetime.strptime(request.end_date, "%Y-%m-%d")
        days_count = (end - start).days + 1

        if days_count <= 0:
            raise HTTPException(status_code=400, detail="End date must be after start date.")

        catalog = request.catalog
        accs = catalog.get("accommodation", [])
        dinings = catalog.get("dining", [])
        acts = catalog.get("activities", [])

        chosen_acc = random.choice(accs) if accs else None

        itinerary = []
        for i in range(days_count):
            current_date = (start + timedelta(days=i)).strftime("%Y-%m-%d")
            day_dining = random.sample(dinings, min(2, len(dinings)))
            day_acts = random.sample(acts, min(2, len(acts)))

            schedule = []
            if len(day_acts) > 0:
                schedule.append({"time": "09:00", "type": "activity", "item": day_acts[0]})
            if len(day_dining) > 0:
                schedule.append({"time": "13:00", "type": "dining", "item": day_dining[0]})
            if len(day_acts) > 1:
                schedule.append({"time": "15:00", "type": "activity", "item": day_acts[1]})
            if len(day_dining) > 1:
                schedule.append({"time": "19:00", "type": "dining", "item": day_dining[1]})

            day_plan = {
                "day_number": i + 1,
                "date": current_date,
                "schedule": schedule
            }

            if i == 0 and chosen_acc:
                day_plan["accommodation"] = chosen_acc

            itinerary.append(day_plan)

        return {"status": "success", "itinerary": itinerary}

    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
    except Exception as e:
        print(f"Auto-Planner Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))