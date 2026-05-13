from playwright.sync_api import sync_playwright
import time


def search_flights():

    with sync_playwright() as p:

        browser = p.chromium.launch(
            headless=False,
            slow_mo=500
        )

        page = browser.new_page()

        page.goto("https://www.skyscanner.co.in")

        page.wait_for_timeout(5000)

        input("Inspect page manually, then press Enter...")

        browser.close()