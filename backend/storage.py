import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

FILE_PATH = os.path.join(BASE_DIR, "alerts.json")


# -----------------------------------
# Load Alerts
# -----------------------------------

def load_alerts():

    if not os.path.exists(FILE_PATH):

        return []

    with open(FILE_PATH, "r") as file:

        data = json.load(file)

    return data


# -----------------------------------
# Save Alert
# -----------------------------------

def save_alert(alert_data):

    # Replace old alerts completely
    alerts = [alert_data]

    with open(FILE_PATH, "w") as file:

        json.dump(alerts, file, indent=4)

    print("ALERT SAVED SUCCESSFULLY")