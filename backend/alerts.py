import requests
import os
from dotenv import load_dotenv

load_dotenv()

WEBHOOK_URL = os.getenv("DISCORD_WEBHOOK_URL")


def send_discord_alert(message):

    data = {
        "content": message
    }

    response = requests.post(
        WEBHOOK_URL,
        json=data
    )

    return response.status_code