from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
import json
from fastapi.middleware.cors import CORSMiddleware
import ollama
from datetime import datetime, timedelta
import random
<<<<<<< HEAD
=======
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from datetime import datetime

>>>>>>> origin/Rohit
# -----------------------------------------
# LOAD ENV VARIABLES

# -----------------------------------------
app = FastAPI()
load_dotenv()
MONGO_URL = os.getenv("MONGO_URL")
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"]
# )

FOURSQUARE_API_KEY = "TPZCOVS2J23QIHPOE41TFYKWKFC4USJKZFLTCW01QTGTKXTM"



url = "http://localhost:11434/api/generate"
SYSTEM_PROMPT=""""
You are an intelligent travel recommendation engine.

You will receive:
- destination
- coordinates
- a list of real places fetched from Foursquare

Your task:
1. Analyze the provided places.
2. Select the BEST top 6 places.
3. Prioritize:
   - popularity
   - tourist appeal
   - variety
   - uniqueness
   - travel experience quality
4. Avoid repeating very similar categories if possible.
5. Generate concise descriptions.
6. Return ONLY valid JSON.
7. Do NOT return markdown.
8. Do NOT explain anything outside JSON.

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
- Use only places from the provided input if possible.
- Keep descriptions short and realistic.
- Output must be valid JSON only.


"""
# -----------------------------------------
# REQUEST MODEL
# -----------------------------------------

class TripRequest(BaseModel):
    destination: str
<<<<<<< HEAD

=======
class ExperienceRequest(BaseModel):
    
    user_id: str

    destination: str

    start_date: str

    end_date: str

    user_experience: str
>>>>>>> origin/Rohit
# -----------------------------------------
# ENDPOINT
# -----------------------------------------

@app.post("/places")

async def get_places(request: TripRequest):
    try:
        

        # -----------------------------------------
        # PHASE 1: GEOCODING USING OPENSTREETMAP
        # -----------------------------------------

        nom_url = (
            f"https://nominatim.openstreetmap.org/search"
            f"?q={request.destination}"
            f"&format=json"
            f"&limit=1"
        )

        nom_headers = {
            "User-Agent": "TraveloopHackathonApp/1.0"
        }

        geo_response = requests.get(
            nom_url,
            headers=nom_headers,
            timeout=5
        )

        geo_data = geo_response.json()

        if not geo_data:
            raise HTTPException(
                status_code=404,
                detail="Destination not found"
            )

        lat = geo_data[0]["lat"]
        lon = geo_data[0]["lon"]

        # -----------------------------------------
        # PHASE 2: FOURSQUARE PLACES API
        # -----------------------------------------

        fsq_url = "https://places-api.foursquare.com/places/search"

        fsq_headers = {
            "Authorization": f"Bearer {FOURSQUARE_API_KEY}",
            "Accept": "application/json",
            "X-Places-Api-Version": "2025-06-17"
        }

        fsq_params = {
            "ll": f"{lat},{lon}",
            "sort": "POPULARITY",
            "limit": 15
        }

        fsq_response = requests.get(
            fsq_url,
            headers=fsq_headers,
            params=fsq_params,
            timeout=5
        )

        print("FSQ STATUS:", fsq_response.status_code)
        print("FSQ RESPONSE:", fsq_response.text)

        real_places = []

        if fsq_response.status_code == 200:

            places_data = fsq_response.json().get("results", [])

            for place in places_data:

                name = place.get("name", "Unknown")

                category = (
                    place["categories"][0]["name"]
                    if place.get("categories")
                    else "General"
                )

                address = (
                    place.get("location", {})
                    .get("formatted_address", "No address")
                )

                distance = place.get("distance", "Unknown")

                real_places.append({
                    "name": name,
                    "category": category,
                    "address": address,
                    "distance_meters": distance
                })

        else:

            raise HTTPException(
                status_code=fsq_response.status_code,
                detail=fsq_response.text
            )

        # -----------------------------------------
        # FINAL RESPONSE
        # -----------------------------------------
        op={
            "destination": request.destination,
            "coordinates": {
                "latitude": lat,
                "longitude": lon
            },
            "places": real_places
            }
        
        data = {
    "model": "llama3",   
    "system": SYSTEM_PROMPT,
    "prompt": str(op),
    "stream": False
}
        response = requests.post(url, json=data)
        final_respo=response.json()["response"]
        
        return final_respo
    except Exception as e:

        print("ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

class TripReq(BaseModel):
    destination: str
    start_date: str
    end_date: str

@app.post("/generate-catalog")
async def generate_catalog(request: TripReq):
    try:
        # --- PHASE A: GEOCODING ---
        nom_url = f"https://nominatim.openstreetmap.org/search?q={request.destination}&format=json&limit=1"
        headers = {"User-Agent": "TraveloopHackathonApp/1.0"} 
        
        geo_response = requests.get(nom_url, headers=headers, timeout=5).json()
        if not geo_response:
             raise HTTPException(status_code=404, detail="Destination not found on the map.")
        
        lat = geo_response[0]["lat"]
        lon = geo_response[0]["lon"]

        # --- PHASE B: LIVE WEATHER ---
        weather_context = "Weather data temporarily unavailable."
        try:
            weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
            weather_data = requests.get(weather_url, timeout=3).json()
            current_temp = weather_data.get("current_weather", {}).get("temperature")
            if current_temp is not None:
                weather_context = f"The current temperature is {current_temp}°C."
        except Exception as weather_err:
            print(f"Weather API timeout/error (ignoring): {weather_err}")

        # --- PHASE C: REAL FOURSQUARE PLACES ---
        fsq_url = "https://places-api.foursquare.com/places/search"

        fsq_headers = {
    "Authorization": f"Bearer {FOURSQUARE_API_KEY}",
    "Accept": "application/json",
    "X-Places-Api-Version": "2025-06-17"
}

        fsq_params = {
    "ll": f"{lat},{lon}",
    "sort": "POPULARITY",
    "limit": 15
}

        fsq_response = requests.get(
    fsq_url,
    headers=fsq_headers,
    params=fsq_params,
    timeout=5
)
        
        real_places = []
        if fsq_response.status_code == 200:
            places_data = fsq_response.json().get("results", [])
            for place in places_data:
                name = place.get("name")
                cat = place["categories"][0]["name"] if place.get("categories") else "General"
                real_places.append(f"{name} ({cat})")
        else:
            real_places = ["No Foursquare data available. Use general popular places."]

        # --- PHASE D: THE PROMPT ---
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

        # --- PHASE E: AI GENERATION (OLLAMA VERSION) ---
        # <--- CHANGED: New API call structure for Ollama
        response = ollama.chat(
            model='llama3:latest', # Make sure you have actually downloaded this via 'ollama run llama3'
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "Generate the catalog JSON now."}
            ],
            format='json', # Forces strict JSON output
            options={
                'temperature': 0.3 # Low temperature for strict schema adherence
            }
        )

        # <--- CHANGED: Extracting the string from Ollama's specific dictionary format
        ai_response = response['message']['content']
        
        return json.loads(ai_response)

    except Exception as e:
        print(f"FATAL Error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
class AutoPlanRequest(BaseModel):
    start_date: str
    end_date: str
    catalog: dict

@app.post("/auto-plan")
async def auto_plan_itinerary(request: AutoPlanRequest):
    try:
        # 1. Calculate the total number of days
        # We parse the string dates into Python datetime objects to do math on them
        start = datetime.strptime(request.start_date, "%Y-%m-%d")
        end = datetime.strptime(request.end_date, "%Y-%m-%d")
        days_count = (end - start).days + 1
        
        if days_count <= 0:
            raise HTTPException(status_code=400, detail="End date must be after start date")

        # 2. Extract the catalog arrays
        catalog = request.catalog
        accs = catalog.get("accommodation", [])
        dinings = catalog.get("dining", [])
        acts = catalog.get("activities", [])

        # 3. Pick 1 random accommodation for the whole trip (if any exist in the catalog)
        chosen_acc = random.choice(accs) if accs else None

        itinerary = []
        
        # 4. Loop through every single day and build the schedule
        for i in range(days_count):
            # Calculate the actual date for this specific day (e.g., Day 2 is start_date + 1)
            current_date = (start + timedelta(days=i)).strftime("%Y-%m-%d")

            # Safely pick 2 random dining spots and 2 random activities
            # We use min() so it doesn't crash if the catalog only generated 1 restaurant
            day_dining = random.sample(dinings, min(2, len(dinings)))
            day_acts = random.sample(acts, min(2, len(acts)))

            schedule = []
            
            # --- ASSEMBLE THE TIMELINE ---
            # Morning Activity
            if len(day_acts) > 0:
                schedule.append({"time": "09:00", "type": "activity", "item": day_acts[0]})
            # Lunch
            if len(day_dining) > 0:
                schedule.append({"time": "13:00", "type": "dining", "item": day_dining[0]})
            # Afternoon Activity
            if len(day_acts) > 1:
                schedule.append({"time": "15:00", "type": "activity", "item": day_acts[1]})
            # Dinner
            if len(day_dining) > 1:
                schedule.append({"time": "19:00", "type": "dining", "item": day_dining[1]})

            # Package the day
            day_plan = {
                "day_number": i + 1,
                "date": current_date,
                "schedule": schedule
            }
            
            # We only attach the accommodation data to Day 1 so the UI can show "Check-in"
            if i == 0 and chosen_acc:
                day_plan["accommodation"] = chosen_acc

            itinerary.append(day_plan)

        return {"status": "success", "itinerary": itinerary}

    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    except Exception as e:
        print(f"Auto-Planner Error: {e}")
        raise HTTPException(status_code=500, detail=str(e)) 
class PackingRequest(BaseModel):
    destination: str
    start_date: str
    end_date: str
    itinerary: list    
@app.post("/generate-packing-list")
async def generate_packing_list(request: PackingRequest):
    try:
        # --- PHASE 1: GEOCODING & WEATHER (Reused for context) ---
        nom_url = f"https://nominatim.openstreetmap.org/search?q={request.destination}&format=json&limit=1"
        headers = {"User-Agent": "TraveloopHackathonApp/1.0"} 
        
        geo_response = requests.get(nom_url, headers=headers, timeout=10).json()
        if not geo_response:
             raise HTTPException(status_code=404, detail="Destination not found on the map.")
        
        lat = geo_response[0]["lat"]
        lon = geo_response[0]["lon"]

        weather_context = "Weather data temporarily unavailable."
        try:
            weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
            weather_data = requests.get(weather_url, timeout=3).json()
            current_temp = weather_data.get("current_weather", {}).get("temperature")
            weather_code = weather_data.get("current_weather", {}).get("weathercode")
            
            # Basic weather code translation for the AI
            condition = "Clear"
            if weather_code in [61, 63, 65, 80, 81, 82]: condition = "Raining"
            elif weather_code in [71, 73, 75, 85, 86]: condition = "Snowing"
                
            if current_temp is not None:
                weather_context = f"The current temperature is {current_temp}°C and the condition is {condition}."
        except Exception as weather_err:
            print(f"Weather API timeout/error (ignoring): {weather_err}")

        # --- PHASE 2: EXTRACT EVENTS ---
        # We parse the complex itinerary JSON to pull out activities AND dining.
        # We format it as a vertical bulleted list so the 3B model reads it as a checklist.
        planned_events = []
        for day in request.itinerary:
            for event in day.get("schedule", []):
                event_type = event.get("type")
                if event_type in ["activity", "dining"]:
                    title = event.get("item", {}).get("title", "Unknown Event")
                    # Append the type so the AI knows if it's a food spot or a physical activity
                    planned_events.append(f"- {title} ({event_type})")
        
        # Remove duplicates and join into a single string block
        planned_events = list(set(planned_events))
        events_text = "\n".join(planned_events)

        # --- PHASE 3: THE OLLAMA PROMPT ---
        # We use aggressive constraints to defeat the 3B model's laziness.
        system_prompt = f"""
        You are a meticulous travel assistant. 
        The user is traveling to {request.destination} from {request.start_date} to {request.end_date}.
        {weather_context}
        
        Here is the exact list of things they are doing on this trip:
        {events_text}
        
        CRITICAL RULES:
        1. You MUST generate a comprehensive packing list.
        2. For EVERY SINGLE EVENT in the list above, you MUST suggest at least one specific item to pack. Do not skip any events.
        3. Include a parenthetical reason linking the item to the weather OR the specific event.
        4. Do not be lazy. Provide a massive, exhaustive list.
        
        You MUST return ONLY a valid JSON object matching this exact schema:
        {{
            "packing_list": [
                {{
                    "category": "Clothing",
                    "items": [
                        "Light jacket (for 18°C weather)", 
                        "Smart casual shirt (for dining at Kikunoi)",
                        "Breathable t-shirt (for hiking Fushimi Inari)"
                    ]
                }},
                {{
                    "category": "Gear & Accessories",
                    "items": [
                        "Slip-on walking shoes (easy to remove at Kinkaku-ji Temple)",
                        "Reusable shopping bag (for Nishiki Market)"
                    ]
                }}
            ]
        }}
        """

        # --- PHASE 4: LOCAL AI GENERATION ---
        response = ollama.chat(
            model='llama3.2:3b', 
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "Generate the exhaustive packing list JSON now."}
            ],
            format='json', 
            options={
                'temperature': 0.5 # Bumped slightly to 0.5 to allow it to brainstorm more items
            }
        )

        ai_response = response['message']['content']
        return json.loads(ai_response)

    except Exception as e:
        print(f"Packing List Error: {e}")
<<<<<<< HEAD
        raise HTTPException(status_code=500, detail=str(e))       
=======
        raise HTTPException(status_code=500, detail=str(e))
     
          
>>>>>>> origin/Rohit
