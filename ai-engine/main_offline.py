from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import ollama # <--- CHANGED: Replaced Groq with Ollama
from dotenv import load_dotenv
import requests
import json
import os

# 1. LOAD SECRETS & INITIALIZE
load_dotenv() 

FOURSQUARE_API_KEY = os.getenv("FOURSQUARE_API_KEY")

# <--- CHANGED: We no longer check for or need a GROQ_API_KEY
if not FOURSQUARE_API_KEY:
    raise RuntimeError("Missing FOURSQUARE_API_KEY! Check your .env file.")

app = FastAPI()

class TripRequest(BaseModel):
    destination: str
    start_date: str
    end_date: str

@app.post("/generate-catalog")
async def generate_catalog(request: TripRequest):
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
        fsq_url = f"https://api.foursquare.com/v3/places/search?ll={lat},{lon}&sort=POPULARITY&limit=15"
        fsq_headers = {
            "accept": "application/json",
            "Authorization": FOURSQUARE_API_KEY
        }
        fsq_response = requests.get(fsq_url, headers=fsq_headers, timeout=5)
        
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
            model='llama3.2:3b', # Make sure you have actually downloaded this via 'ollama run llama3'
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