from apscheduler.schedulers.background import BackgroundScheduler

from backend.storage import load_alerts

from backend.flight_api import (
    get_cheapest_flight,
    get_cheapest_in_time_range
)

from backend.alerts import send_discord_alert


# -----------------------------------
# Main Daily Job
# -----------------------------------

def run_daily_alerts():

    print("\n===== RUNNING DAILY BLUALARM CHECK =====\n")

    alerts = load_alerts()

    print(f"TOTAL ALERTS FOUND: {len(alerts)}")


    for alert in alerts:

        try:

            from_city = alert["from_city"]
            to_city = alert["to_city"]

            travel_date = alert["travel_date"]

            preferred_hour = alert["preferred_hour"]

            flexibility = alert["flexibility"]


            # -----------------------------------
            # Get Flights
            # -----------------------------------

            overall = get_cheapest_flight(
                from_city,
                to_city,
                travel_date
            )

            preferred = get_cheapest_in_time_range(
                from_city,
                to_city,
                travel_date,
                preferred_hour,
                flexibility
            )


            # -----------------------------------
            # Discord Message
            # -----------------------------------

            message = (
                f"✈ Daily BluAlarm Report\n"
                f"Route: {from_city} → {to_city}\n"
                f"Date: {travel_date}\n\n"
            )


            # Overall
            if overall:

                first = overall["flights"][0]

                message += (
                    f"💸 Cheapest Overall Flight\n"
                    f"Airline: {first['airline']}\n"
                    f"Departure: {first['departure_airport']['time']}\n"
                    f"Arrival: {first['arrival_airport']['time']}\n"
                    f"Price: ₹{overall['price']}\n\n"
                )


            # Preferred
            if preferred:

                first = preferred["flights"][0]

                message += (
                    f"🕐 Cheapest Around Preferred Time\n"
                    f"Airline: {first['airline']}\n"
                    f"Departure: {first['departure_airport']['time']}\n"
                    f"Arrival: {first['arrival_airport']['time']}\n"
                    f"Price: ₹{preferred['price']}\n"
                )


            # -----------------------------------
            # Send Discord Alert
            # -----------------------------------

            send_discord_alert(message)

            print(f"ALERT SENT: {from_city} → {to_city}")


        except Exception as e:

            print("SCHEDULER ERROR:", e)


# -----------------------------------
# Scheduler Setup
# -----------------------------------

scheduler = BackgroundScheduler()


# Daily at 8 AM
scheduler.add_job(
    run_daily_alerts,
    trigger="cron",
    hour=10,
    minute=0
)


# Start Scheduler
scheduler.start()

print("BluAlarm Scheduler Started")