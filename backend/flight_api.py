from serpapi import GoogleSearch
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("SERPAPI_API_KEY")


# -----------------------------------
# Get Flights
# -----------------------------------

def get_flights(from_city, to_city, travel_date):

    params = {
        "engine": "google_flights",

        "departure_id": from_city,
        "arrival_id": to_city,

        "outbound_date": travel_date,

        "hl": "en",
        "gl": "in",
        "currency": "INR",

        "type": "2",
        "adults": "1",

        "api_key": API_KEY
    }

    search = GoogleSearch(params)

    results = search.get_dict()

    return results


# -----------------------------------
# Get All Flights
# -----------------------------------

def get_all_flights(from_city, to_city, travel_date):

    results = get_flights(
        from_city,
        to_city,
        travel_date
    )

    flights = []

    if "best_flights" in results:
        flights.extend(results["best_flights"])

    if "other_flights" in results:
        flights.extend(results["other_flights"])

    return flights


# -----------------------------------
# Cheapest Overall Flight
# -----------------------------------

def get_cheapest_flight(
    from_city,
    to_city,
    travel_date
):

    flights = get_all_flights(
        from_city,
        to_city,
        travel_date
    )

    if len(flights) == 0:
        return None

    cheapest = min(
        flights,
        key=lambda x: x.get("price", float('inf'))
    )

    return cheapest


# -----------------------------------
# Cheapest Preferred-Time Flight
# -----------------------------------

def get_cheapest_in_time_range(
    from_city,
    to_city,
    travel_date,
    preferred_hour,
    flexibility=2
):

    flights = get_all_flights(
        from_city,
        to_city,
        travel_date
    )

    filtered_flights = []

    start_hour = preferred_hour - flexibility
    end_hour = preferred_hour + flexibility

    for flight in flights:

        try:

            departure_time = flight["flights"][0]["departure_airport"]["time"]

            # Example:
            # 2026-05-25 13:45

            time_part = departure_time.split(" ")[1]

            hour = int(time_part.split(":")[0])

            if start_hour <= hour <= end_hour:

                filtered_flights.append(flight)

        except:
            continue

    if len(filtered_flights) == 0:
        return None

    cheapest = min(
        filtered_flights,
        key=lambda x: x.get("price", float('inf'))
    )

    return cheapest