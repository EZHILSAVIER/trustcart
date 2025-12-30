from app.services.scraper_engine import scraper_engine
import sys

def test_url(url):
    print(f"Testing URL: {url}")
    result = scraper_engine.scrape_url(url)
    if result:
        print("Success!")
        print(result)
    else:
        print("Failed (returned None)")

if __name__ == "__main__":
    url = "https://www.google.com" # Default test
    if len(sys.argv) > 1:
        url = sys.argv[1]
    test_url(url)
