from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException

from pydantic import BaseModel
from datetime import datetime

from backend.flight_api import (
    get_cheapest_flight,
    get_cheapest_in_time_range
)

from backend.alerts import send_discord_alert

from backend.storage import save_alert

from backend.email_alerts import send_email_alert

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

    email: str


def normalize_travel_date(raw_date: str) -> str:

    if not raw_date:

        raise HTTPException(
            status_code=422,
            detail="Travel date is required."
        )

    cleaned = raw_date.strip().replace("/", "-").replace(".", "-")

    accepted_formats = [
        "%Y-%m-%d",
        "%d-%m-%Y",
        "%m-%d-%Y"
    ]

    for date_format in accepted_formats:

        try:

            parsed = datetime.strptime(cleaned, date_format)

            return parsed.strftime("%Y-%m-%d")

        except ValueError:

            continue

    raise HTTPException(
        status_code=422,
        detail="Invalid travel date format. Use calendar picker or valid date."
    )


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

    normalized_travel_date = normalize_travel_date(data.travel_date)


    # -----------------------------------
    # Save Alert
    # -----------------------------------

    alert_data = {
        "from_city": data.from_city,
        "to_city": data.to_city,
        "travel_date": normalized_travel_date,
        "preferred_hour": data.preferred_hour,
        "flexibility": data.flexibility,
        "email": data.email
    }

    save_alert(alert_data)

    print("ALERT SAVED")


    # -----------------------------------
    # Cheapest Overall
    # -----------------------------------

    overall = get_cheapest_flight(
        data.from_city,
        data.to_city,
        normalized_travel_date
    )


    # -----------------------------------
    # Cheapest Preferred Time
    # -----------------------------------

    preferred = get_cheapest_in_time_range(
        data.from_city,
        data.to_city,
        normalized_travel_date,
        preferred_hour=data.preferred_hour,
        flexibility=data.flexibility
    )


    # -----------------------------------
    # Discord Message
    # -----------------------------------

    message = (
        f"✈ BluAlarm Report\n"
        f"Route: {data.from_city} → {data.to_city}\n"
        f"Date: {normalized_travel_date}\n\n"
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
    # Send Premium HTML Email
    # -----------------------------------

    send_email_alert(
        receiver_email=data.email,
        subject="✈ BluAlarm Flight Intelligence",
        overall=overall_data,
        preferred=preferred_data,
        route=f"{data.from_city} → {data.to_city}",
        travel_date=normalized_travel_date
    )


    # -----------------------------------
    # Return Response
    # -----------------------------------

    return {

        "status": "success",

        "route": f"{data.from_city} → {data.to_city}",

        "travel_date": normalized_travel_date,

        "overall": overall_data,

        "preferred": preferred_data
    }