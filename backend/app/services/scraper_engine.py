import random
import re
import cloudscraper
import requests
from bs4 import BeautifulSoup
from typing import Dict, Any, Optional
from app.ai.nlp_engine import nlp_engine

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
]

class ScraperEngine:
    def __init__(self):
        self.scraper = cloudscraper.create_scraper(
            browser={
                'browser': 'chrome',
                'platform': 'windows',
                'desktop': True
            }
        )

    def scrape_url(self, url: str) -> Dict[str, Any]:
        """
        Extracts product details from a given URL using Beautiful Soup.
        Supports generic sites by looking for common meta tags and selectors.
        """
        try:
            response = self.scraper.get(url, timeout=15)
            if response.status_code != 200:
                print(f"Scraper Error: Status {response.status_code}")
                return {"error": f"Failed to fetch URL. Status Code: {response.status_code}"}
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract Meta Tags (OpenGraph) - Works generically for most sites
            title = self._get_meta_content(soup, "og:title") or soup.title.string
            description = self._get_meta_content(soup, "og:description") or ""
            image_url = self._get_meta_content(soup, "og:image")
            
            # Fallback for Image
            if not image_url:
                image_url = self._find_image(soup)
            
            # Attempt to find Price (Tricky generically)
            price = self._find_price(soup)
            
            # Fallback: Check metadata text if price is still 0
            if price == "0":
                text_to_search = (title or "") + " " + (description or "")
                price_match = self._find_price_in_text(text_to_search)
                if price_match:
                    price = price_match
            
            # Fallback level 2: Scan ENTIRE text for price pattern (if valid price not found yet)
            if price == "0":
                 full_text = soup.get_text(separator=" ", strip=True)
                 price_match = self._find_price_in_text(full_text) # Scan FULL text
                 if price_match:
                     price = price_match
            
            # Attempt to find MRP (Fallback)
            mrp = "0"
            if mrp == "0":
                mrp_match = self._find_mrp(soup)
                if mrp_match:
                    mrp = mrp_match
                else:
                    # 1. Check text
                    full_text = soup.get_text(separator=" ", strip=True)
                    mrp_regex_match = self._find_mrp_in_text(full_text)
                    if mrp_regex_match:
                        mrp = mrp_regex_match
                    else:
                         # 2. Check Raw HTML (for JSON or attributes)
                         mrp_html_match = self._find_mrp_in_text(str(soup))
                         if mrp_html_match:
                             mrp = mrp_html_match

            # AI Extraction to handle missing/complex data
            for script in soup(["script", "style"]):
                script.extract()
                
            # AI Extraction to handle missing/complex data
            ai_data = nlp_engine.extract_product_details(soup.get_text())
            
            if ai_data:
                # Prioritize AI extracted data if valid
                if ai_data.get("price"):
                    price = f"{ai_data.get('currency', '')}{ai_data.get('price')}"
                if ai_data.get("title"):
                    title = ai_data.get("title")
                if ai_data.get("description"):
                    description = ai_data.get("description")
                
            return {
                "title": title.strip() if title else "Unknown Product",
                "description": description.strip() if description else "",
                "image_url": image_url,
                "price": price,
                "image_url": image_url,
                "price": price,
                "mrp": f"{ai_data.get('currency', '')}{ai_data.get('mrp')}" if ai_data.get("mrp") else mrp,
                "category": "category" 
            }

        except Exception as e:
            print(f"Scraping Failed: {e}")
            return {"error": str(e)}

    def _get_meta_content(self, soup, property_name):
        tag = soup.find("meta", property=property_name)
        return tag["content"] if tag else None

    def _find_price(self, soup):
        # Heuristic search for price classes/ids
        price_patterns = [
            "price", "Price", "a-price-whole", "product-price", 
            "selling-price", "offer-price", "_30jeq3" # Flipkart
        ]
        
        for p in price_patterns:
            # Check ID
            elem = soup.find(id=p)
            if elem: return elem.get_text(strip=True)
            # Check Class
            elem = soup.find(class_=p)
            if elem: return elem.get_text(strip=True)
            
        # Fallback: Regex search in likely containers (or whole text if desperate)
        # Look for ₹ or Rs. followed by digits
        price_regex = re.compile(r"(?:₹|Rs\.?)\s?[\d,]+(?:\.\d{2})?")
        
        # Search in common price containers first
        for container in soup.find_all(['span', 'div'], class_=re.compile(r'price|offer|deal', re.I)):
            match = price_regex.search(container.get_text())
            if match:
                return match.group(0)
                
        return "0"

    def _find_price_in_text(self, text):
        if not text: return None
        # Look for ₹ or Rs. followed by digits
        price_regex = re.compile(r"(?:₹|Rs\.?)\s?[\d,]+(?:\.\d{2})?")
        match = price_regex.search(text)
        return match.group(0) if match else None

    def _find_mrp_in_text(self, text, require_label=True):
        if not text: return None
        
        if require_label:
            # Stricter Pattern: Only allow space, colon, dot, currency chars between Label and Number
            # Avoids matching "MRP tags and 1500..." 
            # Pattern: (MRP|List Price...) [ :.-]* (₹|Rs)? \s* (number)
            mrp_regex = re.compile(r"(?:M\.?R\.?P\.?|List Price|Original Price|Price)[\s:.\-]*?(?:₹|Rs\.?|INR)?\s*?(\d[\d,]+\.?\d*)", re.IGNORECASE)
            match = mrp_regex.search(text)
            if match:
                val = match.group(1).replace(",", "")
                if float(val) > 10: return f"₹{match.group(1)}"
        else:
            # Just look for price pattern (for specific elements like strike-through)
            price_regex = re.compile(r"(?:₹|Rs\.?|INR)\s?([\d,]+(?:\.\d{2})?)", re.IGNORECASE)
            match = price_regex.search(text)
            if match:
                 val = match.group(1).replace(",", "")
                 if float(val) > 10: return f"₹{match.group(1)}"
            
        return None

    def _find_mrp(self, soup):
         # 1. Specific classes that imply MRP/Old Price
         mrp_classes = ["a-text-strike", "_3I9_wc", "strike-through", "strikethrough"]
         for cls in mrp_classes:
             elem = soup.find(class_=re.compile(cls, re.IGNORECASE))
             if elem:
                 # Extraction without label requirement
                 mrp = self._find_mrp_in_text(elem.get_text(), require_label=False)
                 if mrp: return mrp

         # 2. Text search for Label + Value matches
         # Look for "M.R.P." text node and check siblings/parent
         for label in ["M.R.P", "MRP", "List Price"]:
             elem = soup.find(text=re.compile(label, re.IGNORECASE))
             if elem and elem.parent:
                  # Check parent text
                  mrp = self._find_mrp_in_text(elem.parent.get_text(), require_label=True)
                  if mrp: return mrp
                  # Check next sibling text
                  if elem.parent.next_sibling:
                      sibling_text = elem.parent.next_sibling.get_text() if hasattr(elem.parent.next_sibling, 'get_text') else str(elem.parent.next_sibling)
                      mrp = self._find_mrp_in_text(sibling_text, require_label=False) # Label was previous node
                      if mrp: return mrp
         return None

    def _find_image(self, soup):
        # 1. Check for Amazon landing image
        img = soup.find(id="landingImage")
        if img: return img.get("data-old-hires") or img.get("src")
        
        # 2. Check for Flipkart image
        images = soup.find_all("img", class_="_396cs4") # Common flipkart class
        if images: return images[0].get("src")

        # 3. Fallback: Find first large-ish image
        for img in soup.find_all("img"):
            src = img.get("src", "")
            if src.startswith("http") and "icon" not in src and "logo" not in src:
               return src
        return None

scraper_engine = ScraperEngine()
