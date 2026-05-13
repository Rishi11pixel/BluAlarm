from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

from backend.flight_api import (
    get_cheapest_flight,
    get_cheapest_in_time_range
)

from backend.alerts import send_discord_alert

from backend.storage import save_alert

# -----------------------------------
# Start Scheduler
# -----------------------------------

import backend.scheduler


app = FastAPI()


# -----------------------------------
# Allow React Frontend
# -----------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------------
# Request Model
# -----------------------------------

class FlightRequest(BaseModel):

    from_city: str
    to_city: str

    preferred_hour: int
    flexibility: int

    travel_date: str


# -----------------------------------
# Root Route
# -----------------------------------

@app.get("/")

def home():

    return {
        "message": "BluAlarm Backend Running"
    }


# -----------------------------------
# Flight Check Route
# -----------------------------------

@app.post("/check-flights")

def check_flights(data: FlightRequest):

    print("\nCHECK FLIGHTS ENDPOINT HIT\n")


    # -----------------------------------
    # Save Alert
    # -----------------------------------

    alert_data = {
        "from_city": data.from_city,
        "to_city": data.to_city,
        "travel_date": data.travel_date,
        "preferred_hour": data.preferred_hour,
        "flexibility": data.flexibility
    }

    print("SAVING ALERT:", alert_data)

    save_alert(alert_data)

    print("SAVE ALERT FUNCTION CALLED")


    # -----------------------------------
    # Cheapest Overall
    # -----------------------------------

    overall = get_cheapest_flight(
        data.from_city,
        data.to_city,
        data.travel_date
    )


    # -----------------------------------
    # Cheapest Preferred Time
    # -----------------------------------

    preferred = get_cheapest_in_time_range(
        data.from_city,
        data.to_city,
        data.travel_date,
        preferred_hour=data.preferred_hour,
        flexibility=data.flexibility
    )


    # -----------------------------------
    # Discord Message
    # -----------------------------------

    message = (
        f"✈ BluAlarm Report\n"
        f"Route: {data.from_city} → {data.to_city}\n"
        f"Date: {data.travel_date}\n\n"
    )


    # -----------------------------------
    # Overall Flight Data
    # -----------------------------------

    overall_data = None

    if overall:

        first = overall["flights"][0]

        overall_data = {
            "airline": first["airline"],
            "departure": first["departure_airport"]["time"],
            "arrival": first["arrival_airport"]["time"],
            "price": overall["price"]
        }

        message += (
            f"💸 Cheapest Overall Flight\n"
            f"Airline: {overall_data['airline']}\n"
            f"Departure: {overall_data['departure']}\n"
            f"Arrival: {overall_data['arrival']}\n"
            f"Price: ₹{overall_data['price']}\n\n"
        )

    else:

        message += "No overall flights found.\n\n"


    # -----------------------------------
    # Preferred Flight Data
    # -----------------------------------

    preferred_data = None

    if preferred:

        first = preferred["flights"][0]

        preferred_data = {
            "airline": first["airline"],
            "departure": first["departure_airport"]["time"],
            "arrival": first["arrival_airport"]["time"],
            "price": preferred["price"]
        }

        message += (
            f"🕐 Cheapest Around Preferred Time\n"
            f"Airline: {preferred_data['airline']}\n"
            f"Departure: {preferred_data['departure']}\n"
            f"Arrival: {preferred_data['arrival']}\n"
            f"Price: ₹{preferred_data['price']}\n"
        )

    else:

        message += "No flights found in preferred time range.\n"


    # -----------------------------------
    # Send Discord Alert
    # -----------------------------------

    send_discord_alert(message)


    # -----------------------------------
    # Return Response
    # -----------------------------------

    return {
        "status": "success",

        "route": f"{data.from_city} → {data.to_city}",

        "travel_date": data.travel_date,

        "overall": overall_data,

        "preferred": preferred_data
    }