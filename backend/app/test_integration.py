
import os
import sys
from dotenv import load_dotenv

load_dotenv()
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.scraper_engine import scraper_engine
from app.services.compliance_engine import compliance_engine

def test_full_pipeline():
    print("Testing Full Analysis Pipeline (Scraper + AI Price + CV)...")
    
    # 1. Scrape
    url = "https://www.amazon.in/Apple-New-iPhone-12-128GB/dp/B08L5TNJHG"
    print(f"\n1. Scraping {url}...")
    try:
        scraped_data = scraper_engine.scrape_url(url)
        
        if "error" in scraped_data:
            print(f"❌ Scraper Failed: {scraped_data['error']}")
            return

        print(f"   Title: {scraped_data.get('title')}")
        print(f"   Price: {scraped_data.get('price')}")
        print(f"   MRP: {scraped_data.get('mrp')}")
        print(f"   Image URL: {scraped_data.get('image_url')}")

        if scraped_data.get("price") == "0":
             print("⚠️  Price is 0. Cloudscraper might be needed or page layout changed.")

    except Exception as e:
        print(f"❌ Scraper Exception: {e}")
        return

    # 2. Compliance (includes CV)
    print("\n2. Running Compliance Analysis (CV)...")
    try:
        # Prepare input like analysis.py
        analysis_input = {
            "title": scraped_data["title"],
            "description": scraped_data["description"],
            "price": scraped_data["price"],
            "mrp": scraped_data.get("mrp", "0"),
            "category": scraped_data["category"],
            "image_url": scraped_data["image_url"]
        }
        
        result = compliance_engine.evaluate_product(analysis_input)
        
        print(f"   Risk Level: {result['risk_level']}")
        print(f"   Score: {result['compliance_score']}")
        print(f"   Violations Found: {len(result['violations'])}")
        
        image_mismatch = any(v.type == "IMAGE_MISMATCH" for v in result['violations'])
        if image_mismatch:
             print("   ⚠️  IMAGE_MISMATCH violation found (CV worked & detected mismatch!)")
        else:
             print("   ✅ No IMAGE_MISMATCH found (CV worked & confirmed match!)")
             
    except Exception as e:
        print(f"❌ Compliance Exception: {e}")

if __name__ == "__main__":
    if not os.getenv("GEMINI_API_KEY"):
         print("WARNING: GEMINI_API_KEY not set")
    test_full_pipeline()
