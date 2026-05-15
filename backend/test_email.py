from email_alerts import send_email_alert


overall = {
    "airline": "Air India",
    "departure": "09:45 AM",
    "arrival": "12:10 PM",
    "price": 5234
}


preferred = {
    "airline": "IndiGo",
    "departure": "01:20 PM",
    "arrival": "03:35 PM",
    "price": 6120
}


send_email_alert(
    "rgoel0110@gmail.com",
    "✈ BluAlarm Flight Intelligence",
    overall,
    preferred,
    route="DEL → BOM",
    travel_date="2026-05-25"
)