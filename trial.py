from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv

# -----------------------------------------
# LOAD ENV VARIABLES
# -----------------------------------------

load_dotenv()

FOURSQUARE_API_KEY = "RZ2KEZF4M5SKAFWT4A5RFOFHIIMSBL1RCR1CLB3FLENR2RFA"

app = FastAPI()

# -----------------------------------------
# REQUEST MODEL
# -----------------------------------------

class TripRequest(BaseModel):
    destination: str

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

        return {
            "destination": request.destination,
            "coordinates": {
                "latitude": lat,
                "longitude": lon
            },
            "places": real_places
        }

    except Exception as e:

        print("ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )