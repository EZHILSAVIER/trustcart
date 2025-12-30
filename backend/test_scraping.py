import requests
import time

API_URL = "http://localhost:8000/api/v1/analysis/"

# Real Amazon/Flipkart URL (Example: A product likely to have violations or just a live product)
# Using a generic "fake" listings or a known product URL might be flaky if the listing expires.
# Let's use a URL that we know scraper_engine can handle roughly, or a dummy valid HTML page if we want to be safe.
# For demo, I'll pass a URL that *looks* real but rely on ScraperEngine's robustness.
# If ScraperEngine uses simple meta tags, any modern site works.

# Let's try to scrape a URL. 
# NOTE: In a real demo, the user would paste a URL in the frontend.
# Here I will verify the backend actually calls the scraper.

test_payload = {
    "url": "https://www.amazon.in/Apple-iPhone-13-128GB-Starlight/dp/B09G9D8KRQ" # Example URL
}

print(f"Testing Realtime Analysis for: {test_payload['url']}")
try:
    resp = requests.post(API_URL, json=test_payload)
    if resp.status_code == 200:
        data = resp.json()
        print("Analysis Success!")
        print(f"Product: {data['name']}")
        print(f"Price: {data['price']}")
        print(f"Violations Found: {len(data['violations'])}")
        for v in data['violations']:
            print(f" - {v['type']}: {v['description']} (Conf: {v.get('confidence')})")
    else:
        print(f"Failed: {resp.status_code} | {resp.text}")
except Exception as e:
    print(f"Error: {e}")
