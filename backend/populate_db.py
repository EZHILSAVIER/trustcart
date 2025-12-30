import requests
import time

API_URL = "http://localhost:8000/api/v1/analysis/"

products = [
    {
        "manual_data": {
            "title": "Rolex Submariner 100% Original Replica First Copy",
            "description": "Best quality first copy watch. Looks 100% same as original. Golden strap.",
            "price": "5000",
            "mrp": "1000000",
            "category": "electronics", 
            "image_url": "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=400"
        }
    },
    {
        "manual_data": {
            "title": "Herbal Miracle Cure for Diabetes Instant Results",
            "description": "Guaranteed cure in 2 days. Magic formula. No side effects.",
            "price": "999",
            "mrp": "2000",
            "category": "food",
            "image_url": "https://images.unsplash.com/photo-1626015528518-bc6a3146486c?auto=format&fit=crop&q=80&w=400"
        }
    },
    {
        "manual_data": {
            "title": "Nike Air Jordan High Copy",
            "description": "Cheap nike shoes. Good for running.",
            "price": "2000",
            "mrp": "15000",
            "category": "clothing",
            "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400"
        }
    },
    {
        "manual_data": {
            "title": "Generic T-Shirt",
            "description": "Blue cotton t-shirt for men. Size L.",
            "price": "500",
            "mrp": "0", # Missing MRP
            "category": "clothing",
            "image_url": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=400"
        }
    },
     {
        "manual_data": {
            "title": "EXTREMELY LOUD SPEAKER BANNED MODEL",
            "description": "This speaker is banned in 5 countries due to loudness.",
            "price": "4000",
            "mrp": "8000",
            "category": "electronics",
            "image_url": "https://images.unsplash.com/photo-1543512214-318c77a799bf?auto=format&fit=crop&q=80&w=400"
        }
    }
]

print("Seeding database...")
for p in products:
    try:
        resp = requests.post(API_URL, json=p)
        if resp.status_code == 200:
            data = resp.json()
            score = data.get("compliance_score")
            print(f"Added: {p['manual_data']['title']} | Score: {score}")
        else:
            print(f"Failed: {p['manual_data']['title']} | {resp.text}")
    except Exception as e:
        print(f"Error: {e}")
    time.sleep(0.5)

print("Seeding complete.")
