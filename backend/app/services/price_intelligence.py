import random
from typing import List, Dict

class PriceIntelligence:
    def __init__(self):
        self.platforms = [
            {
                "name": "Amazon", 
                "base_url": "https://www.amazon.in/s?k=", 
                "icon": "A"
            },
            {
                "name": "Flipkart", 
                "base_url": "https://www.flipkart.com/search?q=", 
                "icon": "F"
            },
            {
                "name": "Croma", 
                "base_url": "https://www.croma.com/search?q=", 
                "icon": "C"
            },
             {
                "name": "Reliance", 
                "base_url": "https://www.reliancedigital.in/search?q=", 
                "icon": "R"
            }
        ]

    def find_deals(self, product_name: str, current_price_str: str) -> List[Dict]:
        if not product_name: return []

        deals = []
        for platform in self.platforms:
            # Construct a reliable deep search link
            query = product_name.replace(" ", "+")
            search_url = f"{platform['base_url']}{query}"
            
            deals.append({
                "platform": platform["name"],
                "price": "View Price", # Honest indicator
                "url": search_url,
                "savings": "" # Cannot calculate without real price
            })

        return deals

price_intelligence = PriceIntelligence()
