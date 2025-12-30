
import os
import sys
from dotenv import load_dotenv

load_dotenv()

# Ensure we can import app modules
# Add the 'backend' directory to sys.path explicitly if needed, 
# assuming we run from 'backend' directory.
sys.path.append(os.path.abspath(os.getcwd()))

from app.services.image_engine import image_engine

def test_cv_analysis():
    print("Starting CV Analysis Test...")
    
    # URL for Nike Air Jordan 1
    image_url = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200"
    
    # Case 1: Valid Match
    print("\n[Case 1] Testing Valid Match (Title: 'Red Nike Sneaker')")
    result_match = image_engine.analyze_image(image_url, product_title="Red Nike Sneaker")
    print(f"Result: {result_match.get('cv_match')} - {result_match.get('details')}")
    
    if result_match.get("cv_match") is True:
        print("✅ PASS: Correctly identified as match.")
    else:
        print("❌ FAIL: Should have matched.")

    # Case 2: Mismatch
    print("\n[Case 2] Testing Mismatch (Title: 'Fresh Organic Bananas')")
    result_mismatch = image_engine.analyze_image(image_url, product_title="Fresh Organic Bananas")
    print(f"Result: {result_mismatch.get('cv_match')} - {result_mismatch.get('details')}")
    
    if result_mismatch.get("cv_match") is False:
        print("✅ PASS: Correctly identified as mismatch.")
    else:
        print("❌ FAIL: Should have detected mismatch.")

if __name__ == "__main__":
    if not os.getenv("GEMINI_API_KEY"):
        print("WARNING: GEMINI_API_KEY not found. Test may assume AI is disabled.")
    test_cv_analysis()
