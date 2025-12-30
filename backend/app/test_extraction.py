
import os
import sys
from dotenv import load_dotenv

load_dotenv()
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.scraper_engine import scraper_engine

def test_extraction():
    print("Testing AI Price Extraction (Live URL)...")
    
    url = "https://www.amazon.in/Apple-New-iPhone-12-128GB/dp/B08L5TNJHG" 
    
    print(f"Scraping {url}...")
    try:
        data = scraper_engine.scrape_url(url)
        print("\nExtracted Data:")
        print(f"Title: {data.get('title')}")
        print(f"Price: {data.get('price')}")
        print(f"MRP: {data.get('mrp')}")
        
        if data.get("price") != "0":
             print("✅ PASS: Extracted non-zero Price.")
        else:
             print("⚠️  WARNING: Price is still 0 (Blocked).")
             
    except Exception as e:
        print(f"Test Failed: {e}")

if __name__ == "__main__":
    if not os.getenv("GEMINI_API_KEY"):
         print("WARNING: GEMINI_API_KEY not set")
    test_extraction()
